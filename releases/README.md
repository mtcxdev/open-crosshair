# 📦 OpenCrosshair Releases Directory

Welcome to the official OpenCrosshair release archive. All public releases are preserved, documented, and organized into individual version folders with verified checksums, asset tables, and direct download links.

---

## 🚀 Latest Stable Release: [v1.1.0](v1.1.0/README.md)

| Platform | Format | Package Name | Size | Direct Download |
| :--- | :--- | :--- | :--- | :--- |
| **Windows** | **Installer (`.exe`)** | `OpenCrosshair Setup 1.1.0.exe` | **84.09 MB** | [Download Installer](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair.Setup.1.1.0.exe) |
| **Windows** | **Portable (`.exe`)** | `OpenCrosshair 1.1.0.exe` | **83.86 MB** | [Download Portable](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair.1.1.0.exe) |
| **Linux** | **AppImage** | `OpenCrosshair-1.1.0.AppImage` | ~85 MB | [Download AppImage](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair-1.1.0.AppImage) |
| **Linux** | **Debian (`.deb`)** | `open-crosshair_1.1.0_amd64.deb` | ~68 MB | [Download .deb](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/open-crosshair_1.1.0_amd64.deb) |
| **macOS** | **DMG (`.dmg`)** | `OpenCrosshair-1.1.0-arm64.dmg` | ~88 MB | [Download .dmg](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair-1.1.0-arm64.dmg) |

---

## 🗂️ All Releases

Each release has dedicated documentation detailing the changes, installation notes, file sizes, and cryptographic SHA-256 checksums:

| Release Version | Release Date | Key Focus / Highlights | Release Folder | GitHub Tag |
| :--- | :--- | :--- | :--- | :--- |
| **v1.1.0** *(Latest)* | Oct 2026 | **Modern UI Redesign, Themes & Accents, 80MB Installer Size Optimization, In-App Donation System** | [📂 `releases/v1.1.0/`](v1.1.0/README.md) | [`v1.1.0`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.1.0) |
| **v1.0.1** | Oct 2026 | **System Tray Minimization, Multiplatform CI/CD Automation, Linux & macOS Support** | [📂 `releases/v1.0.1/`](v1.0.1/README.md) | [`v1.0.1`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.0.1) |
| **v1.0.0** | Oct 2026 | **Initial Public Release, Dual-Window Electron Architecture, Vector Crosshair Studio** | [📂 `releases/v1.0.0/`](v1.0.0/README.md) | [`v1.0.0`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.0.0) |

---

## 🔒 Verification & Security

All pre-compiled release executables are built strictly from open-source code without proprietary blobs or tracking telemetry. To verify file integrity against tampering:

```powershell
# Windows PowerShell
Get-FileHash -Algorithm SHA256 "OpenCrosshair Setup 1.1.0.exe"
```

```bash
# Linux / macOS
sha256sum OpenCrosshair-1.1.0.AppImage
```

Refer to each individual version folder above for the matching cryptographic hashes.
