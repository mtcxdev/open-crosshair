# OPEN CROSSHAIR // V1.0

> An open-source, 100% offline, local-first precision crosshair overlay and vector studio built with a high-contrast brutalist design system.

---

## ⚡ Features

* **🖥️ Always-On-Top Desktop Overlay**:
  * Seamless click-through HUD window (`screen-saver` priority) designed for borderless windowed and desktop gaming.
  * Windows High-DPI compensation to preserve 1:1 pixel sharpness at any scale (100%, 125%, 150%, 200%).
  * True center pixel snapping (`snapSvgTargetsPixelCenter`).
  * Multi-monitor support: choose which display to render on.
* **🎨 Full Multi-Layer Vector Studio**:
  * **Crosshair Arms**: Independent top/bottom/left/right arm controls, T-shape mode, corner rounding, outline thickness, gap, and color.
  * **Center Dot**: Square or circular dot, customizable radius, color, and outline.
  * **Tactical Ring**: Customizable radius, line thickness, dashed segment patterns, and center fill with opacity.
  * **Sniper Chevrons**: Upright or inverted V-shapes with angle offsets.
  * **Shadows & Glow**: Drop shadows and soft glow effects.
  * **Recoil Dynamics**: Live firing bloom and recoil simulation with customizable recovery rates.
* **🏆 Pro Esports Vault & Presets (100% Offline)**:
  * Includes pre-tuned pro player presets (CS2: s1mple, ZywOo; Valorant: TenZ, aspas; Apex Legends, Rust, Overwatch 2).
  * Save, organize, and duplicate unlimited custom crosshairs locally.
  * Offline **Sharecodes** (`OC-XXXXX`): Copy and paste crosshairs with one click without any web accounts or servers.
* **🎮 Game Profile Auto-Detection**:
  * Maps game executables (e.g. `cs2.exe`, `VALORANT-Win64-Shipping.exe`, `r5apex.exe`) to your favorite crosshairs.
  * Automatically switches crosshair when games launch or gain foreground focus.
* **📡 OBS & Streamlabs Streamer Hub**:
  * Built-in local HTTP & WebSocket streaming server running at `http://localhost:3175`.
  * Add as a transparent **Browser Source** in OBS Studio to capture your crosshair cleanly without capturing desktop overlays.
* **🔒 100% Free & Anti-Cheat Safe**:
  * No subscriptions, microtransactions, or internet connection required.
  * Zero memory injection into game processes — completely safe for VAC, Vanguard, EAC, and BattlEye.

---

## 🏗️ Architecture

OpenCrosshair mirrors the proven dual-window architecture reverse-engineered from Crosshair X:

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

## ⌨️ Global Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Shift + X` | Toggle overlay visibility (Show / Hide) |
| `Ctrl + Shift + C` | Re-center overlay to primary display center |

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org) (v18 or higher)

### Run Locally
```bash
# Clone the repository
cd C:\Users\DELL\Projects\open-crosshair

# Install dependencies
npm install

# Run the app
npm start
```

### Development Mode (with Live Hot-Reload)
```bash
npm run dev
```

---

## 📹 Setting Up in OBS Studio

1. In OBS Studio, under **Sources**, click **+** and choose **Browser**.
2. Name the source `Crosshair Overlay`.
3. Set **URL** to: `http://localhost:3175`
4. Set **Width** and **Height** to match your stream resolution (e.g., `1920` x `1080`).
5. Check **Shutdown source when not visible** (optional).
6. Click **OK**. Your crosshair will render in real time on your stream with a transparent background!

---

## 📄 License

MIT License — Free and open source for all players.
