import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Target,
  ZoomIn,
} from 'lucide-react';
import { generateCrosshairSVG } from '../utils/svgGenerator';

export function CrosshairPreview({ config, onTriggerRecoil, onRecenter }) {
  const [bgMode, setBgMode] = useState('grid'); // 'grid' | 'dark' | 'light' | 'range' | 'contrast'
  const [zoomLevel, setZoomLevel] = useState(1); // 1 | 2 | 4 | 8
  const [bloom, setBloom] = useState(0);
  const [isFiring, setIsFiring] = useState(false);
  const [isAds, setIsAds] = useState(false);

  // Dynamic recoil simulation
  const triggerRecoilPulse = () => {
    setIsFiring(true);
    const recoilAmount = 8 * (config.recoilMultiplier || 1.0);
    setBloom(recoilAmount);

    if (onTriggerRecoil) {
      onTriggerRecoil(recoilAmount);
    }

    setTimeout(() => {
      setBloom(0);
      setIsFiring(false);
    }, 150);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      triggerRecoilPulse();
    } else if (e.button === 2) {
      e.preventDefault();
      setIsAds(!isAds);
    }
  };

  const currentScale = (isAds ? (config.scale || 1.0) * 1.5 : (config.scale || 1.0)) * zoomLevel;
  const effectiveConfig = {
    ...config,
    scale: currentScale,
  };

  const svgContent = generateCrosshairSVG(effectiveConfig, {
    bloom: bloom,
    isFiring: isFiring,
    viewBoxSize: 128,
  });

  const getBgClass = () => {
    switch (bgMode) {
      case 'dark':
        return 'bg-[#06080C] text-white';
      case 'light':
        return 'bg-[#F8FAFC] text-slate-900';
      case 'contrast':
        return 'bg-[#007A3D] text-white';
      case 'range':
        return 'bg-gradient-to-b from-[#181C26] via-[#10141D] to-[#0A0D13] text-white';
      case 'grid':
      default:
        return 'bg-[var(--bg-app)] text-[var(--text-main)]';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-surface)] p-6 select-none overflow-hidden relative rounded-3xl border border-[var(--border-subtle)] shadow-sm">
      {/* Top Floating Stats Bar */}
      <div className="flex items-center justify-between pb-4 gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-extrabold text-[var(--text-main)] uppercase tracking-wider">
            {config.name || 'Custom Reticle'}
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--accent)] font-bold">
            {Number(config.scale || 1).toFixed(1)}×
          </span>
          {isAds && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              ADS
            </span>
          )}
        </div>

        {/* Backdrop Presets Segmented Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          {[
            { id: 'grid', label: 'Grid' },
            { id: 'range', label: 'Range' },
            { id: 'dark', label: 'Dark' },
            { id: 'light', label: 'Light' },
            { id: 'contrast', label: 'Chroma' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setBgMode(mode.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                bgMode === mode.id
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        className={`relative flex-1 rounded-2xl border border-[var(--border-medium)] overflow-hidden flex items-center justify-center cursor-crosshair transition-colors duration-200 shadow-inner ${getBgClass()}`}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Grid Background */}
        {bgMode === 'grid' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(circle at center, var(--canvas-grid-dot) 1.2px, transparent 1.2px),
                linear-gradient(to right, var(--canvas-grid-line) 1px, transparent 1px),
                linear-gradient(to bottom, var(--canvas-grid-line) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px, 32px 32px, 32px 32px',
              backgroundPosition: 'center center',
            }}
          />
        )}

        {/* Aim Range Target Silhouette */}
        {bgMode === 'range' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
            <div className="w-24 h-24 rounded-full border border-white/20 -mt-16 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-white/30" />
            </div>
            <div className="absolute w-48 h-56 rounded-t-3xl border border-white/10 mt-36" />
          </div>
        )}

        {/* Center Guide Lines */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-[1px]" style={{ backgroundColor: 'var(--canvas-guide)' }} />
          <div className="absolute h-full w-[1px]" style={{ backgroundColor: 'var(--canvas-guide)' }} />
          <div className="absolute w-32 h-32 rounded-full border" style={{ borderColor: 'var(--canvas-guide)' }} />
          <div className="absolute w-64 h-64 rounded-full border border-dashed" style={{ borderColor: 'var(--canvas-guide)' }} />
        </div>

        {/* Live Vector Crosshair */}
        <div
          className="relative pointer-events-none flex items-center justify-center z-10 transition-transform duration-75"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Firing Indicator */}
        {isFiring && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-pulse shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Recoil Active</span>
          </div>
        )}

        {/* Subtle Canvas Hint */}
        <div className="absolute bottom-3 left-4 text-xs text-[var(--text-muted)] font-medium pointer-events-none">
          Left click: Test recoil &bull; Right click: Test ADS
        </div>
      </div>

      {/* Bottom Canvas Control Toolbar */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
            <span className="text-[var(--text-muted)] font-sans font-medium">Offset:</span>
            <span className="font-bold text-[var(--text-main)] px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              {config.offsetX || 0}, {config.offsetY || 0}
            </span>
          </div>

          {(config.offsetX !== 0 || config.offsetY !== 0) && (
            <button
              type="button"
              onClick={onRecenter}
              className="text-xs text-[var(--accent)] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Center (0, 0)</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Level Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono">
            {[1, 2, 4, 8].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setZoomLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  zoomLevel === lvl
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
              >
                {lvl}x
              </button>
            ))}
          </div>

          {/* Test Shot Button */}
          <button
            type="button"
            onClick={triggerRecoilPulse}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent)] text-[var(--text-main)] text-xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <Play size={13} className="fill-current text-[var(--accent)]" />
            <span>Test Shot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
