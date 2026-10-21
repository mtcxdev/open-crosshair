const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'audit_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1280,820',
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const targets = await res.json();
    const target = targets.find(t => t.url.includes('localhost:5173'));
    if (!target) {
      console.error('Target not found');
      return;
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data);
        callbacks.delete(data.id);
      }
    };

    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result ? res.result.value : null;
    }

    async function takeScreenshot(name) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.result.data, 'base64');
      const filePath = path.join(screenshotsDir, `${name}.png`);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filePath} (${buffer.length} bytes)`);
      return filePath;
    }

    // Reload page to ensure latest vite updates are mounted
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 1200));

    // 1. Studio View
    console.log('Capturing Studio view...');
    await takeScreenshot('01_studio_fixed');

    // 2. Presets View
    console.log('Switching to Presets...');
    await evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Presets'));
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('02_presets_fixed');

    // 3. Game Profiles View
    console.log('Switching to Game Profiles...');
    await evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Game Profiles'));
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('03_game_profiles_fixed');

    // 4. Overlay & OBS View
    console.log('Switching to Overlay & OBS...');
    await evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Overlay & OBS'));
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('04_overlay_hub_fixed');

    // 5. Open Settings Modal
    console.log('Opening Settings modal...');
    await evaluate(`
      const settingsBtn = document.querySelector('button[title*="Settings"]');
      if (settingsBtn) settingsBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('05_settings_fixed');

    // 6. Switch to Light Mode in Settings Modal
    console.log('Testing Light Mode...');
    await evaluate(`
      const lightBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Light Mode'));
      if (lightBtn) lightBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('06_settings_light_fixed');

    // Close Settings to view Light Mode Studio
    await evaluate(`
      const doneBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Done'));
      if (doneBtn) doneBtn.click();
      const studioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Studio'));
      if (studioBtn) studioBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('07_studio_light_fixed');

    ws.close();
  } catch (err) {
    console.error('Error during audit:', err);
  } finally {
    chrome.kill();
  }
}

main();
