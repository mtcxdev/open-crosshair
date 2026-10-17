import React, { useState } from 'react';
import {
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Play,
  RotateCcw,
  Target,
  Maximize2,
  Crosshair as CrosshairIcon,
  Sparkles
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
      // Left Click: Fire weapon simulation
      triggerRecoilPulse();
    } else if (e.button === 2) {
      // Right Click: Toggle ADS zoom
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

  // Background presets
  const getBgClass = () => {
    switch (bgMode) {
      case 'dark':
        return 'bg-[#0A0B0E]';
      case 'light':
        return 'bg-[#E5E7EB] text-black';
      case 'contrast':
        return 'bg-[#007F3E]';
      case 'range':
        return 'bg-gradient-to-b from-[#1C1F26] via-[#14161B] to-[#0E1014]';
      case 'grid':
      default:
        return 'bg-[var(--bg-base)]';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-base)] p-4 select-none overflow-hidden relative">
      {/* Visual Centerpiece Canvas */}
      <div
        className={`relative flex-1 rounded-2xl border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center cursor-crosshair group transition-colors duration-200 shadow-inner ${getBgClass()}`}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Subtle Canvas Background Pattern */}
        {bgMode === 'grid' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `
                radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px, 32px 32px, 32px 32px',
              backgroundPosition: 'center center',
            }}
          />
        )}

        {/* Tactical Aim Range Silhouette Mode */}
        {bgMode === 'range' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            {/* Target dummy head / torso wireframe */}
            <div className="w-24 h-24 rounded-full border border-white/20 -mt-16 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-white/30" />
            </div>
            <div className="absolute w-48 h-56 rounded-t-3xl border border-white/10 mt-36" />
          </div>
        )}

        {/* Center Guide Crosshair Lines (Subtle & Non-distracting) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-[1px] bg-white/[0.04]" />
          <div className="absolute h-full w-[1px] bg-white/[0.04]" />
          <div className="absolute w-32 h-32 rounded-full border border-white/[0.04]" />
          <div className="absolute w-64 h-64 rounded-full border border-white/[0.03] border-dashed" />
        </div>

        {/* The Live Rendered Vector Crosshair */}
        <div
          className="relative pointer-events-none flex items-center justify-center z-10 transition-transform duration-75"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Top Floating Overlay Pills */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)]/80 backdrop-blur-md border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] shadow-sm">
            <span className="font-medium text-[var(--text-main)]">
              {config.name || 'Custom'}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
            <span className="font-mono text-[11px] text-[var(--accent)] font-medium">
              {zoomLevel}x Canvas
            </span>
            {isAds && (
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 font-semibold text-[10px]">
                ADS
              </span>
            )}
          </div>

          {(config.offsetX !== 0 || config.offsetY !== 0) && (
            <div className="px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)]/80 backdrop-blur-md border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
              X:{config.offsetX || 0} Y:{config.offsetY || 0}
            </div>
          )}
        </div>

        {/* Firing Bloom Pulse Indicator */}
        {isFiring && (
          <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Recoil Active</span>
          </div>
        )}

        {/* Interaction Hint (Fades out when engaged) */}
        <div className="absolute bottom-3 left-3 text-[11px] text-[var(--text-tertiary)] pointer-events-none hidden md:block">
          Click canvas to simulate recoil &bull; Right click for ADS
        </div>
      </div>

      {/* Floating Canvas Control Toolbar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        {/* Left: Background Backdrop Presets */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          {[
            { id: 'grid', label: 'Grid' },
            { id: 'range', label: 'Aim Range' },
            { id: 'dark', label: 'Dark' },
            { id: 'light', label: 'Light' },
            { id: 'contrast', label: 'Chroma' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setBgMode(mode.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                bgMode === mode.id
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Right: Zoom Level Selector & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom Segmented Control */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono">
            {[1, 2, 4, 8].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setZoomLevel(lvl)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  zoomLevel === lvl
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold shadow-sm border border-[var(--accent-border)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
                title={`Canvas zoom ${lvl}x`}
              >
                {lvl}x
              </button>
            ))}
          </div>

          {/* Test Shot Button */}
          <button
            type="button"
            onClick={triggerRecoilPulse}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Simulate weapon recoil expansion"
          >
            <Play size={12} className="fill-current text-[var(--accent)]" />
            <span>Test Shot</span>
          </button>

          {/* Re-center Button if offset */}
          {(config.offsetX !== 0 || config.offsetY !== 0) && (
            <button
              type="button"
              onClick={onRecenter}
              className="btn-ghost text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-1"
              title="Reset offset to exact center (0, 0)"
            >
              <RotateCcw size={12} />
              <span>Center</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
