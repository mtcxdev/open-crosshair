const path = require('path');
const fs = require('fs');

/**
 * OpenCrosshair electron-builder afterPack optimization hook.
 * Prunes non-essential Chromium runtime components (WebGPU shader compiler, Vulkan software rasterizer,
 * foreign locale pak files) that are never utilized by the 2D canvas/SVG desktop overlay.
 */
exports.default = async function(context) {
  if (context.electronPlatformName !== 'win32') return;

  const appOutDir = context.appOutDir;

  // Unneeded heavy files for 2D desktop overlay:
  // - dxcompiler.dll (~24.5 MB) & dxil.dll (~1.4 MB): DirectX Shader Compiler for WebGPU (not used)
  // - LICENSES.chromium.html (~20.5 MB): Third-party Chromium license bundle (not needed at runtime)
  //
  // CRITICAL NOTE: ffmpeg.dll and graphics fallback DLLs MUST NEVER be pruned.
  // In Chromium/Electron, the renderer sandbox initialization strictly requires ffmpeg.dll
  // and will terminate with a silent fatal crash ("Renderer process crashed") if missing,
  // causing the desktop application window to remain blank.
  const filesToRemove = [
    'dxcompiler.dll',
    'dxil.dll',
    'LICENSES.chromium.html',
  ];

  for (const file of filesToRemove) {
    const fullPath = path.join(appOutDir, file);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`[afterPack] Pruned non-essential file: ${file}`);
      } catch (err) {
        console.warn(`[afterPack] Could not remove ${file}:`, err.message);
      }
    }
  }

  // Prune foreign language pak files (keep en-US.pak)
  const localesDir = path.join(appOutDir, 'locales');
  if (fs.existsSync(localesDir)) {
    const files = fs.readdirSync(localesDir);
    let prunedCount = 0;
    for (const f of files) {
      if (f !== 'en-US.pak') {
        try {
          fs.unlinkSync(path.join(localesDir, f));
          prunedCount++;
        } catch (_) {}
      }
    }
    console.log(`[afterPack] Pruned ${prunedCount} foreign locale pak files`);
  }
};
