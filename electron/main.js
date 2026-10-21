const { app, BrowserWindow, screen, ipcMain, globalShortcut, Tray, Menu, nativeImage, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const store = require('./store');
const streamerServer = require('./streamerServer');
const gameDetector = require('./gameDetector');

let menuWindow = null;
let overlayWindow = null;
let tray = null;
let isQuitting = false;
let hasShownTrayNotification = false;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Ensure only one instance of OpenCrosshair runs at a time
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('[App] Another instance of OpenCrosshair is already running. Exiting.');
  app.quit();
} else {
  app.on('second-instance', () => {
    if (menuWindow) {
      if (menuWindow.isMinimized()) menuWindow.restore();
      if (!menuWindow.isVisible()) menuWindow.show();
      menuWindow.focus();
    }
  });
}

function createMenuWindow() {
  menuWindow = new BrowserWindow({
    width: 1220,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    frame: false,
    backgroundColor: '#0D0E12',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  menuWindow.on('maximize', () => {
    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.webContents.send('window-maximize-changed', true);
    }
  });

  menuWindow.on('unmaximize', () => {
    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.webContents.send('window-maximize-changed', false);
    }
  });

  menuWindow.webContents.on('console-message', (_e, level, message, line, sourceId) => {
    console.log(`[Renderer Console] [lvl ${level}] ${message} (${sourceId}:${line})`);
  });

  menuWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error(`[Renderer did-fail-load] code ${code}: ${desc} (${url})`);
  });

  menuWindow.webContents.on('render-process-gone', (_e, details) => {
    console.error('[Renderer Process Gone]', details);
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

  // Fallback to guarantee window visibility even if ready-to-show is delayed
  setTimeout(() => {
    if (menuWindow && !menuWindow.isDestroyed() && !menuWindow.isVisible()) {
      menuWindow.show();
    }
  }, 2000);

  // When Studio window is in focus, hide the desktop screen-saver overlay to prevent duplicate crosshairs
  menuWindow.on('focus', () => {
    if (overlayWindow && !overlayWindow.isDestroyed() && store.get('settings')?.overlayEnabled !== false) {
      overlayWindow.hide();
    }
  });

  // When user switches to a game, desktop, or another app, restore the active overlay reticle
  menuWindow.on('blur', () => {
    if (overlayWindow && !overlayWindow.isDestroyed() && store.get('settings')?.overlayEnabled !== false) {
      overlayWindow.showInactive();
    }
  });

  // When closing, minimize to system tray instead of exiting
  menuWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      menuWindow.hide();

      if (overlayWindow && !overlayWindow.isDestroyed() && store.get('settings')?.overlayEnabled !== false) {
        overlayWindow.showInactive();
      }

      if (tray && process.platform === 'win32' && !hasShownTrayNotification) {
        tray.displayBalloon({
          title: 'OpenCrosshair',
          content: 'OpenCrosshair is minimized to your system tray. The crosshair overlay remains active on screen.',
        });
        hasShownTrayNotification = true;
      }
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

function toggleOverlayState(explicitState) {
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

  updateTray();
  return newState;
}

function recenterOverlay() {
  const current = store.get('activeCrosshair') || {};
  current.offsetX = 0;
  current.offsetY = 0;
  store.set('activeCrosshair', current);

  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('crosshair-update', current);
  }

  if (menuWindow && !menuWindow.isDestroyed()) {
    menuWindow.webContents.send('crosshair-recentered', current);
  }
}

function updateTray() {
  if (!tray) return;

  const settings = store.get('settings') || {};
  const isOverlayOn = settings.overlayEnabled !== false;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Studio',
      click: () => {
        if (!menuWindow) createMenuWindow();
        else {
          menuWindow.show();
          menuWindow.focus();
        }
      },
    },
    {
      label: `Overlay: ${isOverlayOn ? 'Active' : 'Muted'} (Ctrl+Shift+X)`,
      type: 'checkbox',
      checked: isOverlayOn,
      click: () => {
        toggleOverlayState();
      },
    },
    {
      label: 'Re-Center Crosshair (Ctrl+Shift+C)',
      click: () => {
        recenterOverlay();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit OpenCrosshair',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip(`OpenCrosshair // ${isOverlayOn ? 'Overlay Active' : 'Overlay Muted'}`);
  tray.setContextMenu(contextMenu);
}

function createTray() {
  try {
    const iconPath = path.join(__dirname, 'assets', 'tray.png');
    let icon;

    if (fs.existsSync(iconPath)) {
      icon = nativeImage.createFromPath(iconPath);
    } else {
      icon = nativeImage.createEmpty();
    }

    tray = new Tray(icon);

    tray.on('click', () => {
      if (!menuWindow) {
        createMenuWindow();
      } else if (menuWindow.isVisible()) {
        menuWindow.focus();
      } else {
        menuWindow.show();
        menuWindow.focus();
      }
    });

    tray.on('double-click', () => {
      if (!menuWindow) {
        createMenuWindow();
      } else {
        menuWindow.show();
        menuWindow.focus();
      }
    });

    updateTray();
  } catch (err) {
    console.warn('[Tray] Could not initialize status tray icon:', err.message);
  }
}

function setupIPC() {
  ipcMain.handle('get-store', () => {
    return store.getAll();
  });

  ipcMain.handle('set-store-key', (_e, key, val) => {
    store.set(key, val);
    return true;
  });

  ipcMain.handle('save-store', (_e, fullData) => {
    store.saveData(fullData);
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
    return toggleOverlayState(explicitState);
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

  ipcMain.handle('is-window-maximized', () => {
    return menuWindow ? menuWindow.isMaximized() : false;
  });

  // Close hides to system tray!
  ipcMain.on('window-close', () => {
    if (menuWindow) menuWindow.close();
  });

  // Open external links in default OS browser
  ipcMain.handle('open-external', (_e, url) => {
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
      shell.openExternal(url);
      return true;
    }
    return false;
  });

  // Dynamic Streamer Port Query & Configuration
  ipcMain.handle('get-streamer-info', () => {
    return {
      port: streamerServer.getPort(),
      url: streamerServer.getUrl(),
      preferredPort: streamerServer.preferredPort,
    };
  });

  ipcMain.handle('set-streamer-port', async (_e, newPort) => {
    const portNum = parseInt(newPort, 10);
    if (portNum >= 1024 && portNum <= 65535) {
      const settings = store.get('settings') || {};
      settings.streamerPort = portNum;
      store.set('settings', settings);

      await streamerServer.restart(portNum, (actualPort, actualUrl) => {
        if (menuWindow && !menuWindow.isDestroyed()) {
          menuWindow.webContents.send('streamer-port-bound', { port: actualPort, url: actualUrl });
        }
      });
    }
    return {
      port: streamerServer.getPort(),
      url: streamerServer.getUrl(),
    };
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
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.opencrosshair.app');
  }

  setupIPC();

  // Start OBS streamer server with dynamic multi-port fallback
  const preferredPort = store.get('settings')?.streamerPort || 3175;
  const activeCrosshair = store.get('activeCrosshair');
  streamerServer.start(preferredPort, activeCrosshair, (actualPort, actualUrl) => {
    console.log(`[StreamerServer] Active on ${actualUrl} (configured: ${preferredPort})`);
    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.webContents.send('streamer-port-bound', { port: actualPort, url: actualUrl });
    }
  });

  createMenuWindow();
  createOverlayWindow();
  createTray();

  // Register Global Hotkeys
  const toggleKey = store.get('settings')?.hotkeys?.toggleOverlay || 'Control+Shift+X';
  globalShortcut.register(toggleKey, () => {
    toggleOverlayState();
  });

  const recenterKey = store.get('settings')?.hotkeys?.recenter || 'Control+Shift+C';
  globalShortcut.register(recenterKey, () => {
    recenterOverlay();
  });

  // Start Game Detector
  const profiles = store.get('gameProfiles') || [];
  if (store.get('settings')?.autoGameDetection !== false) {
    gameDetector.start(profiles, (matched) => {
      onGameDetected(matched);
    });
  }

  app.on('activate', () => {
    if (menuWindow) {
      menuWindow.show();
      menuWindow.focus();
    } else {
      createMenuWindow();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  gameDetector.stop();
  streamerServer.stop();
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

// Do not quit when window is closed; remain in system tray!
app.on('window-all-closed', (e) => {
  e.preventDefault();
});
