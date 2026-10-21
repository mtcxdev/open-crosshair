# OpenCrosshair v1.4.0 — Custom App Icons, Window Controls & High-Contrast Light Mode

- **Version**: `1.4.0`
- **Release Tag**: [`v1.4.0`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.4.0)
- **Status**: Latest Production Release
- **License**: MIT (100% Free & Open Source)

---

## 🌟 What's New in v1.4.0

OpenCrosshair v1.4.0 delivers major UX refinements directly addressing community feedback on application branding, contrast accessibility, window management, and typographic scalability.

### 🎯 1. Custom High-Resolution App & Tray Icons
* **Replaced Default React/Electron Icon**: Created and bundled custom precision crosshair icons across the application executable, Windows taskbar, window titlebar, and system tray.
* **Multi-Resolution Windows Asset**: Built a complete 256x256 down to 16x16 `.ico` binary asset and high-resolution vector-rendered PNGs.
* **Windows Taskbar Identity**: Registered `com.opencrosshair.app` AppUserModelID to ensure Windows taskbar instances group cleanly under OpenCrosshair's branding.

### 🪟 2. Desktop Window Action Controls
* **Integrated Titlebar Controls**: Added dedicated **Minimize**, **Maximize / Restore**, and **Close to Tray** buttons at the right end of the studio topbar.
* **Windows UX Alignment**: Features responsive hover feedback, full maximize/restore state tracking, and classic red hover accent on the close button.

### ☀️ 3. High-Contrast Light Mode & Adaptive Colors
* **Razor-Sharp Readability**: Redesigned light theme color tokens with deep slate `#0F172A` text, defined card borders, and clear surface contrast eliminating pale/washed-out controls.
* **Contrast-Aware Accents**: In light mode, accent colors automatically adapt to rich, WCAG-compliant saturated tones (e.g. `#059669` Emerald, `#2563EB` Blue, `#E11D48` Rose) instead of faint neon tints.
* **Adaptive Canvas Guides**: Center reticle guides and background grid dots now dynamically invert contrast between dark and light themes, ensuring tactical grid lines are always crisp and visible.

### 🔠 4. Customizable Font Sizes
* **User Typography Scaling**: Added interface font size controls under **Application Preferences**:
  * **Small (Compact)**: 11.5px
  * **Default (Medium)**: 13px
  * **Large (Comfortable)**: 14.5px
  * **Spacious**: 16px
* **Proportional Scaling**: Smoothly scales all navigation items, sliders, buttons, inputs, and inspector labels, persisted in local settings.

---

## 📦 Distribution Packages & Verified Checksums

### Windows Deliverables (x64)

| Asset File | Type | Size | SHA-256 Checksum | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair Setup 1.4.0.exe` | NSIS Installer | **86.29 MB** (82.29 MiB) | `E6409DD5281C66035D378AE397FF7C95E256B2D164D87D90E3D765898EFC3D47` | [Download Installer](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/OpenCrosshair.Setup.1.4.0.exe) |
| `OpenCrosshair 1.4.0.exe` | Portable Executable | **86.06 MB** (82.07 MiB) | `CDA2472F472774C04FDC2DEB06447106A11249AC6C61A2F298C1919A7BDABD24` | [Download Portable](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/OpenCrosshair.1.4.0.exe) |

### Linux & macOS Deliverables (Automated CI/CD)

| Asset File | Platform | Architecture | Format | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair-1.4.0.AppImage` | Linux | x86_64 | AppImage (Universal) | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/OpenCrosshair-1.4.0.AppImage) |
| `open-crosshair_1.4.0_amd64.deb` | Linux | x86_64 | Debian / Ubuntu Package | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/open-crosshair_1.4.0_amd64.deb) |
| `open-crosshair-1.4.0.tar.gz` | Linux | x86_64 | Gzipped Tarball | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/open-crosshair-1.4.0.tar.gz) |
| `OpenCrosshair-1.4.0-arm64.dmg` | macOS | Apple Silicon (arm64) | Apple Disk Image | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/OpenCrosshair-1.4.0-arm64.dmg) |
| `OpenCrosshair-1.4.0-arm64-mac.zip` | macOS | Apple Silicon (arm64) | Compressed Archive | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.4.0/OpenCrosshair-1.4.0-arm64-mac.zip) |

---

## 💻 Installation Instructions

### Windows Installer (`.exe`)
1. Download `OpenCrosshair Setup 1.4.0.exe`.
2. Follow the setup wizard to install to your user profile.
3. OpenCrosshair will launch immediately with custom icon and refined UI.

### Windows Portable (`.exe`)
1. Download `OpenCrosshair 1.4.0.exe`.
2. Run directly anywhere without installation or administrator privileges.
