const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayApi', {
  onUpdate: (callback) => {
    ipcRenderer.on('crosshair-update', (_event, data) => callback(data));
  },
  onRecoil: (callback) => {
    ipcRenderer.on('crosshair-recoil', (_event, data) => callback(data));
  },
  pingReady: () => {
    ipcRenderer.send('overlay-ready');
  },
});
