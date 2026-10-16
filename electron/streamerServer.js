const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

class StreamerServer {
  constructor() {
    this.server = null;
    this.wss = null;
    this.port = 3175;
    this.latestState = null;
    this.clients = new Set();
  }

  start(port = 3175, initialState = null) {
    this.port = port;
    this.latestState = initialState;

    if (this.server) {
      this.stop();
    }

    try {
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
          res.end(JSON.stringify({ status: 'ok', port: this.port }));
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
          const content = fs.readFileSync(streamerHtmlPath, 'utf-8');
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

      this.server.listen(this.port, '127.0.0.1', () => {
        console.log(`[StreamerServer] Running at http://localhost:${this.port}`);
      });

      this.server.on('error', (err) => {
        console.warn(`[StreamerServer] Port ${this.port} error:`, err.message);
      });
    } catch (err) {
      console.error('[StreamerServer] Failed to start:', err);
    }
  }

  broadcast(state) {
    this.latestState = state;
    const msg = JSON.stringify({ type: 'UPDATE_CROSSHAIR', data: state });
    for (const client of this.clients) {
      if (client.readyState === 1) { // OPEN
        client.send(msg);
      }
    }
  }

  stop() {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    this.clients.clear();
  }
}

module.exports = new StreamerServer();
