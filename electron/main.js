const { app, BrowserWindow, screen, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const store = require('./store');
const streamerServer = require('./streamerServer');
const gameDetector = require('./gameDetector');

let menuWindow = null;
let overlayWindow = null;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

const fs = require('fs');

function createMenuWindow() {
  menuWindow = new BrowserWindow({
    width: 1220,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    frame: false,
    backgroundColor: '#0A0A0A',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const distPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (process.env.VITE_DEV_SERVER_URL) {
    menuWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (fs.existsSync(distPath)) {
    menuWindow.loadFile(distPath);
  } else {
    menuWindow.loadURL('http://localhost:5173');
  }

  menuWindow.once('ready-to-show', () => {
    menuWindow.show();
  });

  menuWindow.on('closed', () => {
    menuWindow = null;
    if (overlayWindow) {
      overlayWindow.close();
    }
  });
}

function getSelectedDisplay() {
  const displays = screen.getAllDisplays();
  const selectedId = store.get('settings')?.selectedDisplayId;
  const match = displays.find(d => d.id === selectedId);
  return match || screen.getPrimaryDisplay();
}

function applyDpiCompensation(targetWindow, display) {
  if (!targetWindow || targetWindow.isDestroyed()) return;
  const scaleFactor = display?.scaleFactor || 1.0;
  if (scaleFactor !== 1.0) {
    targetWindow.webContents.setZoomFactor(1 / scaleFactor);
  } else {
    targetWindow.webContents.setZoomFactor(1);
  }
}

function createOverlayWindow() {
  const targetDisplay = getSelectedDisplay();
  const { x, y, width, height } = targetDisplay.bounds;

  overlayWindow = new BrowserWindow({
    title: '__OPEN_CROSSHAIR_OVERLAY',
    x,
    y,
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'overlayPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  overlayWindow.loadFile(path.join(__dirname, '..', 'overlay', 'index.html'));

  overlayWindow.webContents.once('did-finish-load', () => {
    applyDpiCompensation(overlayWindow, targetDisplay);

    const activeCrosshair = store.get('activeCrosshair');
    if (activeCrosshair) {
      overlayWindow.webContents.send('crosshair-update', activeCrosshair);
    }

    if (store.get('settings')?.overlayEnabled !== false) {
      overlayWindow.showInactive();
    }
  });

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

function positionOverlayOnDisplay(displayId) {
  if (!overlayWindow || overlayWindow.isDestroyed()) return;
  const displays = screen.getAllDisplays();
  const target = displays.find(d => d.id === displayId) || screen.getPrimaryDisplay();
  const { x, y, width, height } = target.bounds;

  overlayWindow.setBounds({ x, y, width, height });
  applyDpiCompensation(overlayWindow, target);
}

function setupIPC() {
  ipcMain.handle('get-store', () => {
    return store.getAll();
  });

  ipcMain.handle('set-store-key', (_e, key, val) => {
    store.set(key, val);
    return true;
  });

  ipcMain.handle('save-crosshair', (_e, crosshair) => {
    const saved = store.get('savedCrosshairs') || [];
    const index = saved.findIndex(c => c.id === crosshair.id);
    if (index >= 0) {
      saved[index] = crosshair;
    } else {
      saved.unshift(crosshair);
    }
    store.set('savedCrosshairs', saved);
    return saved;
  });

  ipcMain.handle('delete-crosshair', (_e, id) => {
    let saved = store.get('savedCrosshairs') || [];
    saved = saved.filter(c => c.id !== id);
    store.set('savedCrosshairs', saved);
    return saved;
  });

  ipcMain.handle('save-game-profiles', (_e, profiles) => {
    store.set('gameProfiles', profiles);
    gameDetector.start(profiles, (matched) => {
      onGameDetected(matched);
    });
    return profiles;
  });

  ipcMain.handle('update-crosshair', (_e, crosshairData) => {
    store.set('activeCrosshair', crosshairData);

    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.webContents.send('crosshair-update', crosshairData);
    }

    streamerServer.broadcast(crosshairData);
    return true;
  });

  ipcMain.on('trigger-recoil', (_e, amount) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.webContents.send('crosshair-recoil', amount);
    }
  });

  ipcMain.handle('toggle-overlay', (_e, explicitState) => {
    const settings = store.get('settings') || {};
    const newState = explicitState !== undefined ? explicitState : !settings.overlayEnabled;
    settings.overlayEnabled = newState;
    store.set('settings', settings);

    if (overlayWindow && !overlayWindow.isDestroyed()) {
      if (newState) {
        overlayWindow.showInactive();
      } else {
        overlayWindow.hide();
      }
    }

    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.webContents.send('overlay-state-changed', newState);
    }

    return newState;
  });

  ipcMain.handle('get-displays', () => {
    return screen.getAllDisplays().map(d => ({
      id: d.id,
      label: `Display ${d.id} (${d.bounds.width}x${d.bounds.height})`,
      bounds: d.bounds,
      scaleFactor: d.scaleFactor,
      isPrimary: d.id === screen.getPrimaryDisplay().id,
    }));
  });

  ipcMain.handle('select-display', (_e, displayId) => {
    const settings = store.get('settings') || {};
    settings.selectedDisplayId = displayId;
    store.set('settings', settings);
    positionOverlayOnDisplay(displayId);
    return true;
  });

  // Window Controls
  ipcMain.on('window-minimize', () => {
    if (menuWindow) menuWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (!menuWindow) return;
    if (menuWindow.isMaximized()) {
      menuWindow.unmaximize();
    } else {
      menuWindow.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    if (menuWindow) menuWindow.close();
  });
}

function onGameDetected(matchedProfile) {
  console.log(`[GameDetector] Focused game: ${matchedProfile.gameName} (${matchedProfile.processName})`);
  const allSaved = [...(store.get('savedCrosshairs') || [])];
  const matchedCrosshair = allSaved.find(c => c.id === matchedProfile.crosshairId);

  if (matchedCrosshair && menuWindow && !menuWindow.isDestroyed()) {
    menuWindow.webContents.send('game-profile-switched', {
      profile: matchedProfile,
      crosshair: matchedCrosshair,
    });
  }
}

app.whenReady().then(() => {
  setupIPC();

  // Start OBS streamer server
  const activeCrosshair = store.get('activeCrosshair');
  streamerServer.start(3175, activeCrosshair);

  createMenuWindow();
  createOverlayWindow();

  // Register Global Hotkeys
  const toggleKey = store.get('settings')?.hotkeys?.toggleOverlay || 'Control+Shift+X';
  globalShortcut.register(toggleKey, () => {
    const settings = store.get('settings') || {};
    const newState = !settings.overlayEnabled;
    settings.overlayEnabled = newState;
    store.set('settings', settings);

    if (overlayWindow && !overlayWindow.isDestroyed()) {
      if (newState) overlayWindow.showInactive();
      else overlayWindow.hide();
    }

    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.webContents.send('overlay-state-changed', newState);
    }
  });

  // Start Game Detector
  const profiles = store.get('gameProfiles') || [];
  if (store.get('settings')?.autoGameDetection !== false) {
    gameDetector.start(profiles, (matched) => {
      onGameDetected(matched);
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMenuWindow();
      createOverlayWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  gameDetector.stop();
  streamerServer.stop();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
