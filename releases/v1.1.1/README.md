# OpenCrosshair v1.1.1 — Dynamic Multi-Port Fallback & Process Guard

- **Version**: `1.1.1`
- **Release Tag**: [`v1.1.1`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.1.1)
- **Status**: Latest Production Release
- **License**: MIT (100% Free & Open Source)

---

## 🌟 What's New in v1.1.1

OpenCrosshair v1.1.1 resolves port contention, adds intelligent multi-port failover, and protects against duplicate background instances.

### 🌐 1. Dynamic Multi-Port Fallback (Zero Port Lockouts)
* **Intelligent Port Scanning**: The internal OBS streaming server no longer relies on a single hardcoded port. If the default port `3175` is occupied by another app, firewall restriction, or zombie process, OpenCrosshair automatically scans and binds to the next available free port (`3176`, `3177`...) without throwing `EADDRINUSE` or failing.
* **Ephemeral Port Protection**: If an entire port range is busy, OpenCrosshair asks the operating system for a dynamically assigned ephemeral free port.

### 🎛️ 2. User-Configurable Streaming Port
* Added a **"Change Port"** control in the **Overlay & Broadcast Hub** (`OverlayHub.jsx`).
* Users can set any custom port between `1024` and `65535` with live feedback and instant server rebinding.
* If automatic fallback was required, the UI clearly displays an `Auto-routed (Port 3175 Busy)` notice.
* The OBS Browser Source copy URL automatically reflects the active bound port.

### 🛡️ 3. Single-Instance Application Lock
* Added `app.requestSingleInstanceLock()`.
* If a user launches OpenCrosshair while an existing instance is already running (e.g. minimized to the system tray), the secondary process exits immediately and refocuses the active window, completely preventing orphan background processes from hoarding network ports.

---

## 📦 Distribution Packages & Verified Checksums

### Windows Deliverables (x64)

| Asset File | Type | Size | SHA-256 Checksum | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair Setup 1.1.1.exe` | NSIS Installer | **84.09 MB** (80.19 MiB) | `039D9B1D4C3ACD7104A23D7F4B4BBF3C28C59AFC986D0E866BC796852F31E309` | [Download Installer](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair.Setup.1.1.1.exe) |
| `OpenCrosshair 1.1.1.exe` | Portable Executable | **83.86 MB** (79.97 MiB) | `E872FB67D166EE67DD7513108BA2CD3F8AD7BE769AF394259D8D8CE6CCE8512B` | [Download Portable](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair.1.1.1.exe) |

### Linux & macOS Deliverables (Automated CI/CD)

| Asset File | Platform | Architecture | Format | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair-1.1.1.AppImage` | Linux | x86_64 | AppImage (Universal) | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair-1.1.1.AppImage) |
| `open-crosshair_1.1.1_amd64.deb` | Linux | x86_64 | Debian / Ubuntu Package | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/open-crosshair_1.1.1_amd64.deb) |
| `open-crosshair-1.1.1.tar.gz` | Linux | x86_64 | Gzipped Tarball | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/open-crosshair-1.1.1.tar.gz) |
| `OpenCrosshair-1.1.1-arm64.dmg` | macOS | Apple Silicon (arm64) | Apple Disk Image | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair-1.1.1-arm64.dmg) |
| `OpenCrosshair-1.1.1-arm64-mac.zip` | macOS | Apple Silicon (arm64) | Compressed Archive | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.1/OpenCrosshair-1.1.1-arm64-mac.zip) |

---

## 💻 Installation Instructions

### Windows Installer (`.exe`)
1. Download `OpenCrosshair Setup 1.1.1.exe`.
2. Follow the setup wizard to install to your user profile.

### Windows Portable (`.exe`)
1. Download `OpenCrosshair 1.1.1.exe`.
2. Run directly anywhere without installation.
