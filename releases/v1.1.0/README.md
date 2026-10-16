# OpenCrosshair v1.1.0 — Modern UI, Installer Size Optimization & Donation System

- **Version**: `1.1.0`
- **Release Tag**: [`v1.1.0`](https://github.com/mtcxdev/open-crosshair/releases/tag/v1.1.0)
- **Status**: Latest Stable Release
- **License**: MIT (100% Free & Open Source)

---

## 🌟 Major Highlights & What's New

OpenCrosshair v1.1.0 is a major milestone release delivering a completely reimagined desktop interface, drastic installer and disk footprint reductions, and an open-source community support system.

### 🎨 1. Modern, Refined UI/UX Redesign
* **Sophisticated Gaming Aesthetic**: Replaced the previous brutalist theme with a sleek, dark-first desktop interface inspired by high-precision creative software and premium gaming utilities.
* **Streamlined Workspace Layout**:
  * **Slim Sidebar Rail**: Quick switching between **Studio**, **Presets**, **Games**, **Overlay**, and **Settings**.
  * **Center Stage Viewport**: Expanded preview canvas with responsive zoom controls (1x, 2x, 4x, 8x), toggleable background grid, and high-visibility preview backdrops.
  * **Collapsible Customization Inspector**: Clean accordions for independent Arms, Center Dot, Tactical Ring, Sniper Chevrons, Drop Shadows, and Recoil Dynamics.
* **Dynamic Themes & Accent Customization**:
  * Switch effortlessly between **Dark**, **Light**, and **System** display modes.
  * 7 vibrant accent palettes: Emerald, Cyan, Violet, Amber, Rose, Lime, and Blue.

### ⚡ 2. Windows Installer & Disk Size Optimization
* **17.76 MB Package Reduction**: Reduced the Windows installer from **101.85 MB** down to **84.09 MB** (-17.4%).
* **Portable Executable**: Reduced from **101.62 MB** down to **83.86 MB** (79.97 MiB).
* **33.5% Smaller Disk Footprint**: Unpacked installation size reduced from **400.9 MB** to **266.5 MB** (-134.4 MB).
* **98.4% Smaller Payload (`app.asar`)**: Shrank application payload from **32.55 MB** to **530 KB** by moving development overhead out of production bundles.
* **Pruned Unneeded Chromium Runtimes**: Eliminated unused WebGPU compilers (`dxcompiler.dll`, `dxil.dll`), software Vulkan rasterizers (`vk_swiftshader.dll`), FFmpeg audio/video libraries, and 54 foreign locale packs, running exclusively on Direct3D 11 ANGLE hardware acceleration.

### 💖 3. Community Donation & Sponsorship System
* **In-App Donation Dialog**: Added a dedicated sponsorship modal accessible from the top header and sidebar navigation rail.
* **Direct Funding Platforms**: One-click links to support development via **GitHub Sponsors** and **Buy Me a Coffee**.
* **Direct Crypto Donations**: Built-in 1-click address copy for **Bitcoin (BTC)**, **Ethereum / USDT (ERC-20)**, and **Solana (SOL)**.
* **Zero Paywalls**: OpenCrosshair remains 100% free with zero locked features, zero advertisements, and zero data collection.

---

## 📦 Distribution Packages & Verified Checksums

### Windows Deliverables (x64)

| Asset File | Type | Size | SHA-256 Checksum | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair Setup 1.1.0.exe` | NSIS Installer | **84.09 MB** (80.19 MiB) | `2AFC97557CFDA1908DCFBA4AB8AABDA2CB128039A897816C80F729864E13242B` | [Download Installer](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair.Setup.1.1.0.exe) |
| `OpenCrosshair 1.1.0.exe` | Portable Executable | **83.86 MB** (79.97 MiB) | `301A72570EFC4B798CB23B6906E9DF08F91202BB7DAD65C48B28F2D3C61CDE7E` | [Download Portable](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair.1.1.0.exe) |

### Linux & macOS Deliverables (Automated CI/CD)

| Asset File | Platform | Architecture | Format | Download |
| :--- | :--- | :--- | :--- | :--- |
| `OpenCrosshair-1.1.0.AppImage` | Linux | x86_64 | AppImage (Universal) | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair-1.1.0.AppImage) |
| `open-crosshair_1.1.0_amd64.deb` | Linux | x86_64 | Debian / Ubuntu Package | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/open-crosshair_1.1.0_amd64.deb) |
| `open-crosshair-1.1.0.tar.gz` | Linux | x86_64 | Gzipped Tarball | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/open-crosshair-1.1.0.tar.gz) |
| `OpenCrosshair-1.1.0-arm64.dmg` | macOS | Apple Silicon (arm64) | Apple Disk Image | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair-1.1.0-arm64.dmg) |
| `OpenCrosshair-1.1.0-arm64-mac.zip` | macOS | Apple Silicon (arm64) | Compressed Archive | [Download](https://github.com/mtcxdev/open-crosshair/releases/download/v1.1.0/OpenCrosshair-1.1.0-arm64-mac.zip) |

---

## 💻 Installation Instructions

### Windows Installer (`.exe`)
1. Download `OpenCrosshair Setup 1.1.0.exe`.
2. Double-click the installer and follow setup steps.
3. OpenCrosshair installs to your user directory without requiring administrator privileges, creating desktop and Start Menu shortcuts.

### Windows Portable (`.exe`)
1. Download `OpenCrosshair 1.1.0.exe`.
2. Move it to any folder of your choice (USB drives supported).
3. Run directly. Settings are stored safely in `%APPDATA%\open-crosshair\`.

### Linux (AppImage)
```bash
chmod +x OpenCrosshair-1.1.0.AppImage
./OpenCrosshair-1.1.0.AppImage
```

### Linux (Debian / Ubuntu)
```bash
sudo dpkg -i open-crosshair_1.1.0_amd64.deb
```

### macOS (Apple Silicon)
1. Download `OpenCrosshair-1.1.0-arm64.dmg`.
2. Open the disk image and drag OpenCrosshair to `Applications`.
