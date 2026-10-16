const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Store & Settings
  getStore: () => ipcRenderer.invoke('get-store'),
  setStoreKey: (key, val) => ipcRenderer.invoke('set-store-key', key, val),
  saveCrosshair: (crosshair) => ipcRenderer.invoke('save-crosshair', crosshair),
  deleteCrosshair: (id) => ipcRenderer.invoke('delete-crosshair', id),
  saveGameProfiles: (profiles) => ipcRenderer.invoke('save-game-profiles', profiles),

  // Crosshair Overlay & Streaming
  updateCrosshair: (crosshairData) => ipcRenderer.invoke('update-crosshair', crosshairData),
  triggerRecoil: (amount) => ipcRenderer.send('trigger-recoil', amount),
  toggleOverlay: (enabled) => ipcRenderer.invoke('toggle-overlay', enabled),

  // Display & Multi-Monitor
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  selectDisplay: (displayId) => ipcRenderer.invoke('select-display', displayId),

  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // Event Listeners
  onGameSwitched: (callback) => {
    ipcRenderer.on('game-profile-switched', (_event, profile) => callback(profile));
  },
  onOverlayStateChanged: (callback) => {
    ipcRenderer.on('overlay-state-changed', (_event, state) => callback(state));
  },
});
