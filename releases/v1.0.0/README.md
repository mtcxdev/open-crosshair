# OpenCrosshair v1.0.0 — Initial Release

- **Version**: `1.0.0`
- **Release Tag**: [`v1.0.0`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.0.0)
- **Status**: Stable Production
- **License**: MIT (100% Free & Open Source)

---

## 🌟 Highlights & Features

OpenCrosshair v1.0.0 is the foundational release of the 100% local-first, offline precision crosshair overlay utility.

* **Dual-Window Electron Architecture**: High-speed typed IPC connecting the vector Studio window and the transparent always-on-top click-through Overlay window.
* **Always-On-Top Click-Through Overlay**: Hardware-accelerated desktop overlay configured at `screen-saver` priority, passing through all game inputs (`setIgnoreMouseEvents(true, { forward: true })`).
* **Sub-Pixel Coordinate Precision**: Prevents blurriness at 1080p, 1440p, and 4K resolutions by rounding crosshair centers to exact physical screen pixels.
* **Precision Layer Studio**: Independent customization for 4 crosshair arms, center dot, tactical ring, sniper chevrons, and drop shadows/glow.
* **Pro Esports Vault**: Pre-tuned offline presets for CS2 (s1mple, ZywOo), Valorant (TenZ, aspas), Apex Legends, and Overwatch.
* **Game Auto-Detection**: Background process poller mapping executables (`cs2.exe`, `VALORANT-Win64-Shipping.exe`, etc.) to custom crosshairs.
* **OBS / Streamlabs Studio Hub**: Embedded WebSocket and HTTP server running at `http://localhost:3175` for stream overlays.
* **100% Anti-Cheat Safe**: Zero game memory injection or DLL hooks.

---

## 📦 Distribution Packages

| Package | Platform | Target | Description | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair Setup 1.0.0.exe` | Windows | x64 NSIS | Full installer with desktop & Start Menu shortcuts | [Download (.exe)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.0/OpenCrosshair.Setup.1.0.0.exe) |
| `OpenCrosshair 1.0.0.exe` | Windows | x64 Portable | Standalone portable executable (no install required) | [Download (.exe)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.0/OpenCrosshair.1.0.0.exe) |

---

## 💻 Installation Instructions

### Windows Installer (`.exe`)
1. Download `OpenCrosshair Setup 1.0.0.exe`.
2. Run the installer and select your destination folder.
3. Launch OpenCrosshair from your Start Menu or Desktop.

### Windows Portable (`.exe`)
1. Download `OpenCrosshair 1.0.0.exe`.
2. Place it anywhere on your machine (e.g. `C:\Games\OpenCrosshair\` or USB drive).
3. Double-click to run immediately without installation.
