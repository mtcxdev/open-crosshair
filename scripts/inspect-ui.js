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
    await new Promise(r => setTimeout(r, 2000));

    // Ensure dark theme and emerald accent for initial studio view
    await evaluate(`
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-accent', 'emerald');
      document.documentElement.style.removeProperty('--accent');
      localStorage.setItem('och_theme', 'dark');
      localStorage.setItem('och_accent', 'emerald');
    `);
    await new Promise(r => setTimeout(r, 500));

    // 1. Studio View (Ultra Dark + Icon)
    console.log('Capturing Studio view (Dark Mode + App Icon)...');
    await takeScreenshot('01_studio_dark_icon');

    // 2. Presets View
    console.log('Switching to Presets...');
    await evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Presets'));
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('02_presets_view');

    // 3. Open Settings Modal (Swatches + Icon + Color Picker)
    console.log('Opening Settings modal...');
    await evaluate(`
      const settingsBtn = document.querySelector('button[title*="Settings"]');
      if (settingsBtn) settingsBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('03_settings_dark_swatches');

    // 4. Test Custom Hex Accent
    console.log('Testing Custom Hex Accent (#E11D48)...');
    await evaluate(`
      const input = document.querySelector('input[placeholder="HEX..."]');
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'E11D48');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('04_settings_custom_hex');

    // 5. Test Light Mode
    console.log('Testing Light Mode...');
    await evaluate(`
      const lightBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Light Mode'));
      if (lightBtn) lightBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('05_settings_light');

    // 6. Close Settings & View Light Mode Studio
    await evaluate(`
      const doneBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Done'));
      if (doneBtn) doneBtn.click();
      const studioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Studio'));
      if (studioBtn) studioBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('06_studio_light');

    // 7. Restore to Dark Mode & Emerald for default state
    await evaluate(`
      const settingsBtn = document.querySelector('button[title*="Settings"]');
      if (settingsBtn) settingsBtn.click();
    `);
    await new Promise(r => setTimeout(r, 400));
    await evaluate(`
      const darkBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Dark Mode'));
      if (darkBtn) darkBtn.click();
      const emeraldBtn = document.querySelector('button[title="Emerald"]');
      if (emeraldBtn) emeraldBtn.click();
      const doneBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Done'));
      if (doneBtn) doneBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot('07_studio_dark_restored');

    ws.close();
  } catch (err) {
    console.error('Error during audit:', err);
  } finally {
    chrome.kill();
  }
}

main();
