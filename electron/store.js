const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class LocalStore {
  constructor() {
    this.userDataPath = app.getPath('userData');
    this.filePath = path.join(this.userDataPath, 'open-crosshair-store.json');
    this.data = this.loadData();
  }

  getDefaultData() {
    return {
      activeCrosshair: {
        id: 'cs2-s1mple',
        name: 's1mple (CS2)',
        game: 'Counter-Strike 2',
        scale: 1.0,
        rotation: 0,
        opacity: 1.0,
        offsetX: 0,
        offsetY: 0,
        recoilMultiplier: 1.2,
        layers: {
          dot: { enabled: false, size: 1, color: '#00F0FF', outline: true, outlineColor: '#000000', outlineWidth: 1, shape: 'square' },
          lines: {
            enabled: true,
            length: 8,
            thickness: 2,
            gap: 3,
            color: '#00F0FF',
            outline: true,
            outlineColor: '#000000',
            outlineWidth: 1,
            borderRadius: 0,
            top: true,
            bottom: true,
            left: true,
            right: true,
            tShape: false,
          },
          ring: { enabled: false },
          chevron: { enabled: false },
        },
        shadow: { enabled: false },
      },
      savedCrosshairs: [],
      gameProfiles: [
        { processName: 'cs2.exe', gameName: 'Counter-Strike 2', crosshairId: 'cs2-s1mple' },
        { processName: 'VALORANT-Win64-Shipping.exe', gameName: 'Valorant', crosshairId: 'val-tenz' },
        { processName: 'r5apex.exe', gameName: 'Apex Legends', crosshairId: 'apex-red-dot' },
        { processName: 'RustClient.exe', gameName: 'Rust', crosshairId: 'rust-chevron' },
        { processName: 'Overwatch.exe', gameName: 'Overwatch 2', crosshairId: 'overwatch-sniper' },
      ],
      settings: {
        overlayEnabled: true,
        selectedDisplayId: null,
        hotkeys: {
          toggleOverlay: 'Control+Shift+X',
          recenter: 'Control+Shift+C',
        },
        streamerServer: {
          enabled: true,
          port: 3175,
        },
        autoGameDetection: true,
      },
    };
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('Failed to read local store, using defaults:', err);
    }
    const defaults = this.getDefaultData();
    this.saveData(defaults);
    return defaults;
  }

  saveData(dataToSave) {
    try {
      if (!fs.existsSync(this.userDataPath)) {
        fs.mkdirSync(this.userDataPath, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save data to local store:', err);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.saveData();
  }

  getAll() {
    return this.data;
  }
}

module.exports = new LocalStore();
