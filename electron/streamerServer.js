const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { WebSocketServer } = require('ws');

/**
 * Checks whether a specific TCP port is available on 127.0.0.1.
 */
function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true)).close();
      })
      .listen(port, '127.0.0.1');
  });
}

/**
 * Finds an available port starting from preferredPort, scanning up to maxAttempts.
 * If all ports in the range are busy, requests an ephemeral available port from the OS.
 */
async function findAvailablePort(preferredPort = 3175, maxAttempts = 50) {
  const start = Math.max(1024, Math.min(65535, preferredPort));
  for (let p = start; p < start + maxAttempts && p <= 65535; p++) {
    const available = await checkPortAvailable(p);
    if (available) return p;
  }

  // Fallback to OS-assigned ephemeral free port
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const assignedPort = srv.address().port;
      srv.close(() => resolve(assignedPort));
    });
  });
}

class StreamerServer {
  constructor() {
    this.server = null;
    this.wss = null;
    this.preferredPort = 3175;
    this.actualPort = 3175;
    this.latestState = null;
    this.clients = new Set();
    this.isStarting = false;
  }

  getPort() {
    return this.actualPort;
  }

  getUrl() {
    return `http://localhost:${this.actualPort}`;
  }

  async start(preferredPort = 3175, initialState = null, onBound = null) {
    if (this.isStarting) return;
    this.isStarting = true;

    this.preferredPort = preferredPort;
    this.latestState = initialState;

    if (this.server) {
      this.stop();
    }

    try {
      const portToUse = await findAvailablePort(this.preferredPort);
      this.actualPort = portToUse;

      this.server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        if (req.url === '/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', port: this.actualPort, preferredPort: this.preferredPort }));
          return;
        }

        if (req.url === '/api/state') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(this.latestState || {}));
          return;
        }

        // Serve streamer HTML
        const streamerHtmlPath = path.join(__dirname, '..', 'streamer', 'index.html');
        if (fs.existsSync(streamerHtmlPath)) {
          let content = fs.readFileSync(streamerHtmlPath, 'utf-8');
          // Inject dynamic active port into streamer HTML if it connects via websocket
          content = content.replace(/ws:\/\/localhost:\d+/g, `ws://localhost:${this.actualPort}`);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        } else {
          res.writeHead(404);
          res.end('Streamer view not found');
        }
      });

      this.wss = new WebSocketServer({ server: this.server });

      this.wss.on('connection', (ws) => {
        this.clients.add(ws);
        if (this.latestState) {
          ws.send(JSON.stringify({ type: 'UPDATE_CROSSHAIR', data: this.latestState }));
        }

        ws.on('close', () => {
          this.clients.delete(ws);
        });

        ws.on('error', () => {
          this.clients.delete(ws);
        });
      });

      this.server.listen(this.actualPort, '127.0.0.1', () => {
        console.log(`[StreamerServer] Running at ${this.getUrl()} (preferred: ${this.preferredPort})`);
        if (onBound) {
          onBound(this.actualPort, this.getUrl());
        }
      });

      this.server.on('error', (err) => {
        console.warn(`[StreamerServer] Port ${this.actualPort} encountered error:`, err.message);
      });
    } catch (err) {
      console.error('[StreamerServer] Failed to start:', err);
    } finally {
      this.isStarting = false;
    }
  }

  async restart(newPreferredPort, onBound) {
    this.stop();
    await this.start(newPreferredPort, this.latestState, onBound);
  }

  broadcast(state) {
    this.latestState = state;
    const msg = JSON.stringify({ type: 'UPDATE_CROSSHAIR', data: state });
    for (const client of this.clients) {
      if (client.readyState === 1) { // OPEN
        try {
          client.send(msg);
        } catch (_) {}
      }
    }
  }

  stop() {
    if (this.wss) {
      try {
        this.wss.close();
      } catch (_) {}
      this.wss = null;
    }
    if (this.server) {
      try {
        this.server.close();
      } catch (_) {}
      this.server = null;
    }
    this.clients.clear();
  }
}

module.exports = new StreamerServer();
