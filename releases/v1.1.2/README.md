# OpenCrosshair v1.1.2 — Production Renderer Stability & Blank Screen Fix

- **Version**: `1.1.2`
- **Release Tag**: [`v1.1.2`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.1.2)
- **Status**: Latest Production Release
- **License**: MIT (100% Free & Open Source)

---

## 🌟 What's New in v1.1.2

OpenCrosshair v1.1.2 delivers a critical stability fix resolving the blank screen issue encountered in production builds on Windows.

### 🛠️ 1. Resolved Production Blank Screen (Chromium Sandbox Initialization)
* **Root Cause**: During size optimization in v1.1.0/v1.1.1, `ffmpeg.dll` was pruned from the binary distribution alongside unused WebGPU components. In Chromium/Electron 44, the renderer sandbox initialization strictly validates media libraries on launch; omitting `ffmpeg.dll` triggered an immediate fatal renderer process crash (`Renderer process crashed`), causing the desktop application window to display only a blank `#0D0E12` background.
* **Resolution**: Updated `scripts/afterPack.js` to strictly preserve `ffmpeg.dll` and fallback rendering libraries (`vk_swiftshader.dll`, `vulkan-1.dll`), ensuring 100% stability across all Windows systems and hardware configurations.
* **Size Preservation**: Maintained low package footprint (~86 MB vs original 102 MB) by pruning unnecessary WebGPU shader compilers (`dxcompiler.dll`, `dxil.dll`), license documentation, and foreign locale files.

### 🛡️ 2. Enhanced Diagnostic Monitoring & Window Visibility Fallback
* Added `render-process-gone` and detailed IPC diagnostic hooks to the Electron main process for immediate telemetry if Chromium renderer anomalies occur.
* Added a visibility guarantee timer to ensure the primary window presents smoothly even if OS window manager events are delayed.
* Wrapped tray initialization defensively so headless or restricted Windows notification tray environments initialize cleanly without interruption.

---

## 📦 Distribution Packages & Verified Checksums

### Windows Deliverables (x64)

| Asset File | Type | Size | SHA-256 Checksum | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair Setup 1.1.2.exe` | NSIS Installer | **86.24 MB** (82.24 MiB) | `3865BFCD68D2DC4CE560058F27C507E210E30CD537B746D9BC5040B415CA15D3` | [Download Installer](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/OpenCrosshair.Setup.1.1.2.exe) |
| `OpenCrosshair 1.1.2.exe` | Portable Executable | **86.01 MB** (82.02 MiB) | `D1419E2CFDAE1FEBBC1E290D30A5BBDF0C4EAA06BC99386F93603909C55AE886` | [Download Portable](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/OpenCrosshair.1.1.2.exe) |

### Linux & macOS Deliverables (Automated CI/CD)

| Asset File | Platform | Architecture | Format | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair-1.1.2.AppImage` | Linux | x86_64 | AppImage (Universal) | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/OpenCrosshair-1.1.2.AppImage) |
| `open-crosshair_1.1.2_amd64.deb` | Linux | x86_64 | Debian / Ubuntu Package | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/open-crosshair_1.1.2_amd64.deb) |
| `open-crosshair-1.1.2.tar.gz` | Linux | x86_64 | Gzipped Tarball | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/open-crosshair-1.1.2.tar.gz) |
| `OpenCrosshair-1.1.2-arm64.dmg` | macOS | Apple Silicon (arm64) | Apple Disk Image | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/OpenCrosshair-1.1.2-arm64.dmg) |
| `OpenCrosshair-1.1.2-arm64-mac.zip` | macOS | Apple Silicon (arm64) | Compressed Archive | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.2/OpenCrosshair-1.1.2-arm64-mac.zip) |

---

## 💻 Installation Instructions

### Windows Installer (`.exe`)
1. Download `OpenCrosshair Setup 1.1.2.exe`.
2. Follow the setup wizard to install to your user profile.
3. OpenCrosshair will launch immediately with the full interactive Studio UI.

### Windows Portable (`.exe`)
1. Download `OpenCrosshair 1.1.2.exe`.
2. Run directly anywhere without installation or administrator privileges.
