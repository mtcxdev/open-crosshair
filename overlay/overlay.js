const target = document.getElementById('overlay-target');
let currentConfig = null;
let currentBloom = 0;
let recoilAnimationId = null;

function render(bloom = 0) {
  if (!currentConfig || !currentConfig.svg) return;
  target.innerHTML = currentConfig.svg;
}

if (window.overlayApi) {
  window.overlayApi.onUpdate((data) => {
    currentConfig = data;
    render(currentBloom);
  });

  window.overlayApi.onRecoil((recoilAmount = 6) => {
    // Dynamic bloom recoil pulse animation
    let start = performance.now();
    const duration = 160; // ms to expand and snap back
    const maxBloom = recoilAmount * (currentConfig?.recoilMultiplier || 1.0);

    if (recoilAnimationId) {
      cancelAnimationFrame(recoilAnimationId);
    }

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);

      // Fast expansion, smooth recovery curve
      if (progress < 0.25) {
        currentBloom = (progress / 0.25) * maxBloom;
      } else {
        currentBloom = maxBloom * (1 - (progress - 0.25) / 0.75);
      }

      render(currentBloom);

      if (progress < 1) {
        recoilAnimationId = requestAnimationFrame(animate);
      } else {
        currentBloom = 0;
        render(0);
        recoilAnimationId = null;
      }
    }

    recoilAnimationId = requestAnimationFrame(animate);
  });

  window.overlayApi.pingReady();
}
