/**
 * Sharecode codec utility for OpenCrosshair
 * Encodes crosshair configuration into a compact, human-copyable string (100% offline).
 */

export function encodeSharecode(config) {
  try {
    const cleanConfig = {
      name: config.name || 'Custom',
      scale: config.scale,
      rotation: config.rotation,
      opacity: config.opacity,
      offsetX: config.offsetX,
      offsetY: config.offsetY,
      recoilMultiplier: config.recoilMultiplier,
      layers: config.layers,
      shadow: config.shadow,
    };
    const jsonStr = JSON.stringify(cleanConfig);
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return `OC-${base64}`;
  } catch (err) {
    console.error('Failed to encode sharecode:', err);
    return null;
  }
}

export function decodeSharecode(sharecode) {
  try {
    let cleanCode = sharecode.trim();
    if (cleanCode.startsWith('OC-')) {
      cleanCode = cleanCode.substring(3);
    }
    const jsonStr = decodeURIComponent(escape(atob(cleanCode)));
    const config = JSON.parse(jsonStr);
    return config;
  } catch (err) {
    console.error('Invalid sharecode format:', err);
    return null;
  }
}
