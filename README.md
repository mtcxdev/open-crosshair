# 🎯 OPEN CROSSHAIR // V1.0

<p align="center">
  <img src="https://img.shields.io/badge/LICENSE-MIT-CCFF00?style=for-the-badge&logo=opensourceinitiative&logoColor=black" alt="License" />
  <img src="https://img.shields.io/badge/PLATFORM-WINDOWS%20%7C%20LINUX%20%7C%20MACOS-00F0FF?style=for-the-badge&logo=electron&logoColor=black" alt="Platform" />
  <img src="https://img.shields.io/badge/ANTI--CHEAT-100%25%20SAFE-00FF66?style=for-the-badge" alt="Anti-Cheat" />
  <img src="https://img.shields.io/badge/OFFLINE-ZERO%20TELEMETRY-FF0055?style=for-the-badge" alt="Offline" />
</p>

> **OpenCrosshair** is a 100% free, open-source, local-first precision crosshair overlay and vector studio built with a high-contrast Neo-Brutalist design system. It recreates the multi-window architecture of professional overlay tools with zero subscriptions, zero ads, zero telemetry, and zero internet requirements.

---

## ⚡ Key Highlights

* **🖥️ Always-On-Top Desktop Overlay**:
  * Real-time transparent click-through HUD window (`screen-saver` priority level).
  * Automatic Windows High-DPI compensation (100%, 125%, 150%, 200%) preserving crisp 1:1 pixel rendering.
  * Sub-pixel coordinate snapping to prevent antialiasing blur around screen center.
  * Multi-monitor support: select any target display.
* **🎨 Precision Vector Crosshair Studio**:
  * **Independent Arms**: Top/Bottom/Left/Right controls, T-Shape toggle, corner rounding, outline thickness, gap, and colors.
  * **Center Dot**: Square or circular dot, customizable radius, color, and outline.
  * **Tactical Ring**: Customizable radius, line thickness, dashed segment patterns, and center fill with opacity.
  * **Sniper Chevrons**: Upright or inverted V-shapes with angle offsets.
  * **Shadows & Glow**: Drop shadows and soft glow effects for high visibility against complex game textures.
  * **Dynamic Recoil & ADS**: Live firing bloom simulation with customizable recovery rates and Aim-Down-Sights (ADS) zoom.
* **🏆 Pro Esports Vault (100% Offline)**:
  * Includes pre-tuned pro player presets (CS2: s1mple, ZywOo; Valorant: TenZ, aspas; Apex Legends, Rust, Overwatch 2).
  * Save, organize, and duplicate unlimited custom crosshairs locally.
  * **Sharecodes (`OC-XXXXX`)**: One-click copy/paste shareable codes without any web accounts or servers.
* **🎮 Game Profile Auto-Detection**:
  * Maps game executables (e.g. `cs2.exe`, `VALORANT-Win64-Shipping.exe`, `r5apex.exe`, `RustClient.exe`) to your favorite crosshairs.
  * Automatically switches crosshair when games launch or gain foreground focus.
* **📡 OBS & Streamlabs Streamer Hub**:
  * Built-in local HTTP & WebSocket streaming server running at `http://localhost:3175`.
  * Add as a transparent **Browser Source** in OBS Studio to capture your crosshair cleanly without capturing desktop overlays.
* **🔒 100% Anti-Cheat Safe**:
  * Zero memory injection into game processes — completely safe for VAC, Vanguard, EAC, and BattlEye.

---

## 📥 Downloads & Installation

Pre-built binaries are available under [Releases](https://github.com/mtcxdev/open-crosshair/releases):

### Windows (x64)
* **Portable (`.exe`)**: `OpenCrosshair 1.0.0.exe` — Run directly without installation.
* **Installer (`.exe`)**: `OpenCrosshair Setup 1.0.0.exe` — Standard desktop installer with Start Menu shortcuts.

### Linux
* **AppImage**: `OpenCrosshair-1.0.0.AppImage` — Run on any modern Linux distribution (`chmod +x OpenCrosshair-*.AppImage && ./OpenCrosshair-*.AppImage`).
* **Debian Package (`.deb`)**: `opencrosshair_1.0.0_amd64.deb` (`sudo dpkg -i opencrosshair_*.deb`).

### macOS (Intel & Apple Silicon)
* **DMG**: `OpenCrosshair-1.0.0.dmg` — Drag & Drop to Applications folder.

---

## ⌨️ Global Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Shift + X` | Toggle overlay visibility (Show / Hide) |
| `Ctrl + Shift + C` | Re-center overlay to primary display center |

---

## 🏗️ Architecture

OpenCrosshair mirrors the proven dual-window, low-latency architecture reverse-engineered from professional overlay tools:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OpenCrosshair (Electron)                        │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │   MenuWindow (React)  │  Typed IPC  │   OverlayWindow (Electron) │  │
│  │   • Brutalist Studio  │ ──────────> │   • Transparent Window     │  │
│  │   • Preset Vault      │             │   • Always-on-Top Clickthru│  │
│  │   • Game Profile Map  │             │   • Recoil Bloom Pulse     │  │
│  └───────────────────────┘             └────────────────────────────┘  │
│              │                                        ▲                │
│              ▼                                        │                │
│  ┌─────────────────────────────────────────────────┐  │                │
│  │                  Core Services                  │  │                │
│  │  • Local Store (app.getPath('userData'))        │──┘                │
│  │  • GameDetector (Foreground Process Poller)     │                   │
│  │  • StreamerServer (Local HTTP/WS on :3175)      │                   │
│  └─────────────────────────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📹 Setting Up in OBS Studio / Streamlabs

1. In OBS Studio, under **Sources**, click **+** and choose **Browser**.
2. Name the source `Crosshair Overlay`.
3. Set **URL** to: `http://localhost:3175`
4. Set **Width** and **Height** to match your canvas resolution (e.g. `1920` x `1080` or `2560` x `1440`).
5. Click **OK**. Your crosshair will render in real time on your stream with a transparent background.

---

## 🛠️ Building From Source

### Prerequisites
* [Node.js](https://nodejs.org) (v18 or higher)
* [npm](https://www.npmjs.com/) (v9 or higher)

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/mtcxdev/open-crosshair.git
cd open-crosshair

# Install dependencies
npm install

# Run in production mode
npm start

# Run in development mode (with live HMR)
npm run dev
```

### Build Distribution Packages
```bash
# Build Windows .exe (portable & setup installer)
npm run dist

# Build standalone portable .exe only
npm run dist:portable

# Multi-platform build
npm run dist:all
```

---

## 📄 License

Distributed under the **MIT License**. Free and open-source for all players.
