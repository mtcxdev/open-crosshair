# OpenCrosshair v1.0.1 — Multiplatform & System Tray Release

- **Version**: `1.0.1`
- **Release Tag**: [`v1.0.1`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.0.1)
- **Status**: Stable Production
- **License**: MIT (100% Free & Open Source)

---

## 🌟 Highlights & What's New

OpenCrosshair v1.0.1 introduces system tray integration and automated multiplatform packaging for Windows, Linux, and macOS.

* **System Tray Minimization**: Closing the application window no longer terminates the process. OpenCrosshair now silently minimizes to the Windows notification area / system tray so the crosshair overlay remains active during gameplay.
* **System Tray Context Menu**:
  * Quick access to toggle overlay visibility (`Ctrl+Shift+X`)
  * Re-center crosshair to screen center (`Ctrl+Shift+C`)
  * Open main Studio window
  * Full quit option
* **Multiplatform CI/CD Automation**: Integrated GitHub Actions build matrix compiling release packages for Windows, Linux, and macOS concurrently.
* **Linux Support**: Added `.AppImage`, Debian (`.deb`), and `.tar.gz` distribution targets.
* **macOS Support**: Added Apple Silicon (`arm64`) `.dmg` and `.zip` distribution targets with unsigned identity handling.

---

## 📦 Distribution Packages

| Package | Platform | Target | Description | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair Setup 1.0.1.exe` | Windows | x64 NSIS | Full installer with Start Menu shortcuts | [Download (.exe)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/OpenCrosshair.Setup.1.0.1.exe) |
| `OpenCrosshair 1.0.1.exe` | Windows | x64 Portable | Standalone portable executable | [Download (.exe)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/OpenCrosshair.1.0.1.exe) |
| `OpenCrosshair-1.0.1.AppImage` | Linux | AppImage | Universal Linux executable | [Download (.AppImage)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/OpenCrosshair-1.0.1.AppImage) |
| `open-crosshair_1.0.1_amd64.deb` | Linux | Debian/Ubuntu | Native Debian package | [Download (.deb)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/open-crosshair_1.0.1_amd64.deb) |
| `open-crosshair-1.0.1.tar.gz` | Linux | Tarball | Portable Linux archive | [Download (.tar.gz)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/open-crosshair-1.0.1.tar.gz) |
| `OpenCrosshair-1.0.1-arm64.dmg` | macOS | Apple Silicon DMG | Drag-and-drop installer for macOS | [Download (.dmg)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/OpenCrosshair-1.0.1-arm64.dmg) |
| `OpenCrosshair-1.0.1-arm64-mac.zip`| macOS | Apple Silicon Zip | Portable macOS archive | [Download (.zip)](https://github.com/mtcxdev/open-crosshair/releases/download/v1.0.1/OpenCrosshair-1.0.1-arm64-mac.zip) |

---

## 💻 Installation Instructions

### Windows
* **Installer**: Run `OpenCrosshair Setup 1.0.1.exe` and follow setup prompts.
* **Portable**: Double-click `OpenCrosshair 1.0.1.exe` to run immediately.

### Linux
* **AppImage**:
  ```bash
  chmod +x OpenCrosshair-1.0.1.AppImage
  ./OpenCrosshair-1.0.1.AppImage
  ```
* **Debian/Ubuntu (`.deb`)**:
  ```bash
  sudo dpkg -i open-crosshair_1.0.1_amd64.deb
  ```

### macOS
* Open `OpenCrosshair-1.0.1-arm64.dmg` and drag the OpenCrosshair icon into your `Applications` folder.
