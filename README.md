# 🎯 OpenCrosshair // v1.1.1

<p align="center">
  <img src="https://img.shields.io/badge/VERSION-v1.1.1-emerald?style=for-the-badge&logo=github&logoColor=white" alt="Version" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=black" alt="License" />
  <img src="https://img.shields.io/badge/PLATFORM-WINDOWS%20%7C%20LINUX%20%7C%20MACOS-blue?style=for-the-badge&logo=electron&logoColor=white" alt="Platform" />
  <img src="https://img.shields.io/badge/ANTI--CHEAT-100%25%20SAFE-green?style=for-the-badge" alt="Anti-Cheat" />
  <img src="https://img.shields.io/badge/OFFLINE-ZERO%20TELEMETRY-rose?style=for-the-badge" alt="Offline" />
</p>

> **OpenCrosshair** is a 100% free, open-source, local-first precision crosshair overlay and vector studio with a refined, customizable modern UI. Recreating the multi-window architecture of professional overlay tools with zero subscriptions, zero ads, zero telemetry, and zero internet dependencies.

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
* **📡 OBS & Streamlabs Streamer Hub (Dynamic Multi-Port)**:
  * Built-in local HTTP & WebSocket streaming server with automatic conflict scanning (falls back from 3175 to free ports).
  * Custom port configurator directly inside the Overlay Hub.
  * Add as a transparent **Browser Source** in OBS Studio to capture your crosshair cleanly without capturing desktop overlays.
* **🔒 100% Anti-Cheat Safe**:
  * Zero memory injection into game processes — completely safe for VAC, Vanguard, EAC, and BattlEye.

---

## 📥 Downloads & Installation

> [!TIP]
> 📂 All releases are documented with release notes, package sizes, and SHA-256 checksums in the [**Releases Directory (`releases/`)**](releases/README.md).

### Latest Release: [OpenCrosshair v1.1.1](releases/v1.1.1/README.md)

| Platform | Format | Package | Size | Direct Download |
| :--- | :--- | :--- | :--- | :--- |
| **Windows (x64)** | **Installer (`.exe`)** | `OpenCrosshair Setup 1.1.1.exe` | **84.09 MB** | [Download Installer](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair.Setup.1.1.1.exe) |
| **Windows (x64)** | **Portable (`.exe`)** | `OpenCrosshair 1.1.1.exe` | **83.86 MB** | [Download Portable](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair.1.1.1.exe) |
| **Linux** | **AppImage** | `OpenCrosshair-1.1.1.AppImage` | ~85 MB | [Download AppImage](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair-1.1.1.AppImage) |
| **Linux** | **Debian (`.deb`)** | `open-crosshair_1.1.1_amd64.deb` | ~68 MB | [Download .deb](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/open-crosshair_1.1.1_amd64.deb) |
| **macOS** | **DMG (`.dmg`)** | `OpenCrosshair-1.1.1-arm64.dmg` | ~88 MB | [Download .dmg](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair-1.1.1-arm64.dmg) |

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

## 💖 Support & Donate

OpenCrosshair is 100% free, open-source software built and maintained for the gaming community. It will forever remain free with zero locked features, zero ads, zero accounts, and zero telemetry.

If OpenCrosshair improves your gameplay or helps you build the perfect crosshair, consider supporting ongoing development:

<p align="left">
  <a href="https://github.com/sponsors/mtcxdev" target="_blank">
    <img src="https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors" />
  </a>
  <a href="https://buymeacoffee.com/mtcxdev" target="_blank">
    <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me A Coffee" />
  </a>
</p>

### 🪙 Direct Crypto Donations (1-Click Copy in Desktop App)
* **Bitcoin (BTC)**: `bc1q9h60032l84p3n8y793r33q604v0n70vxq3h888`
* **Ethereum / USDT (ERC-20)**: `0x71C94bCde17D9a572c6F255a6d36e2f1704D1B99`
* **Solana (SOL)**: `7NxU5p5aZ9L7w2GvB98VwM84V8xV546Zk48N9x2kG5v1`

---

## 📄 License

Distributed under the **MIT License**. Free and open-source for all players.
