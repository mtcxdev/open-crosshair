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

  // Unneeded heavy DLLs and files for 2D desktop overlay
  const filesToRemove = [
    'dxcompiler.dll',          // ~24.5 MB: DirectX Shader Compiler for WebGPU (not used)
    'dxil.dll',                // ~1.4 MB: DirectX Intermediate Language for WebGPU (not used)
    'vk_swiftshader.dll',      // ~5.3 MB: Software Vulkan rasterizer (Direct3D 11 ANGLE is used)
    'vulkan-1.dll',            // ~0.9 MB: Vulkan loader (Direct3D 11 ANGLE is used)
    'ffmpeg.dll',              // ~3.1 MB: Audio/video decoding (OpenCrosshair is pure 2D canvas/SVG)
    'LICENSES.chromium.html',  // ~20.5 MB: Third-party Chromium license bundle (not needed at runtime)
    'vk_swiftshader_icd.json', // Manifest for removed vk_swiftshader.dll
  ];

  for (const file of filesToRemove) {
    const fullPath = path.join(appOutDir, file);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`[afterPack] Pruned unused runtime library: ${file}`);
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
