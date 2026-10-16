import React, { useState, useEffect } from 'react';
import { Target, Crosshair, Grid, ZoomIn, Play, Maximize2 } from 'lucide-react';
import { generateCrosshairSVG } from '../utils/svgGenerator';

export function CrosshairPreview({ config, onTriggerRecoil }) {
  const [bgMode, setBgMode] = useState('grid'); // 'grid' | 'tactical' | 'contrast' | 'dark'
  const [bloom, setBloom] = useState(0);
  const [isFiring, setIsFiring] = useState(false);
  const [isAds, setIsAds] = useState(false);

  // Dynamic recoil simulation
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Left Click: Fire
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
    } else if (e.button === 2) {
      // Right Click: Toggle ADS zoom
      e.preventDefault();
      setIsAds(!isAds);
    }
  };

  const currentScale = isAds ? (config.scale || 1.0) * 1.5 : (config.scale || 1.0);
  const effectiveConfig = {
    ...config,
    scale: currentScale,
  };

  const svgContent = generateCrosshairSVG(effectiveConfig, {
    bloom: bloom,
    isFiring: isFiring,
    viewBoxSize: 128,
  });

  // Background styles
  const getBgStyle = () => {
    switch (bgMode) {
      case 'tactical':
        return {
          background: 'linear-gradient(135deg, #2b302c 0%, #1e2220 50%, #171a18 100%)',
          backgroundImage: 'radial-gradient(circle at center, rgba(140, 160, 140, 0.15) 0%, transparent 70%)',
        };
      case 'contrast':
        return {
          backgroundColor: '#008000', // Green screen contrast check
        };
      case 'dark':
        return {
          backgroundColor: '#050608',
        };
      case 'grid':
      default:
        return {
          backgroundColor: '#0E1017',
          backgroundImage: `
            linear-gradient(to right, #1B1E2B 1px, transparent 1px),
            linear-gradient(to bottom, #1B1E2B 1px, transparent 1px),
            radial-gradient(circle, #CCFF00 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 24px 24px, 120px 120px',
          backgroundPosition: 'center center',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0B0E] p-4 select-none">
      {/* Viewport Card */}
      <div
        className="relative flex-1 brutal-card border-2 border-[#262A3B] overflow-hidden flex items-center justify-center cursor-crosshair group"
        style={getBgStyle()}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Subtle Crosshair Guide Lines */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-[1px] bg-white/5"></div>
          <div className="absolute h-full w-[1px] bg-white/5"></div>
          <div className="absolute w-40 h-40 rounded-full border border-white/5"></div>
          <div className="absolute w-80 h-80 rounded-full border border-white/5 border-dashed"></div>
        </div>

        {/* The Live Rendered Vector Crosshair */}
        <div
          className="relative pointer-events-none flex items-center justify-center z-10 transition-transform duration-75"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Top-Left Telemetry Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="brutal-badge">VIEWPORT</span>
            <span className="text-[#8E95A5]">128x128 PX</span>
          </div>
          <div className="text-[#8E95A5] text-[10px]">
            SCALE: <span className="text-[#CCFF00] font-bold">{currentScale.toFixed(2)}X</span>
            {isAds && <span className="text-[#00F0FF] ml-1">[ADS ON]</span>}
          </div>
          <div className="text-[#8E95A5] text-[10px]">
            OFFSET: <span className="text-white">X:{config.offsetX || 0} Y:{config.offsetY || 0}</span>
          </div>
        </div>

        {/* Top-Right Firing Simulator Hint */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#12141C]/80 backdrop-blur border border-[#262A3B] px-2.5 py-1 text-[11px] font-mono text-[#8E95A5]">
          <span className="text-[#CCFF00] font-bold">L-CLICK:</span> TEST RECOIL
          <span className="text-[#262A3B]">|</span>
          <span className="text-[#00F0FF] font-bold">R-CLICK:</span> ADS ZOOM
        </div>

        {/* Bottom-Right Active Weapon Firing Pulse Indicator */}
        {isFiring && (
          <div className="absolute bottom-3 right-3 font-mono text-xs font-bold text-[#FF0055] bg-black/80 px-2 py-0.5 border border-[#FF0055] animate-ping">
            FIRE PULSE
          </div>
        )}
      </div>

      {/* Viewport Control Bar */}
      <div className="mt-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#8E95A5] uppercase text-[10px] tracking-wider">Backdrop:</span>
          <button
            onClick={() => setBgMode('grid')}
            className={`px-2.5 py-1 border text-[11px] font-mono transition-all ${
              bgMode === 'grid'
                ? 'bg-[#CCFF00] text-black border-black font-bold shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            AIM GRID
          </button>
          <button
            onClick={() => setBgMode('tactical')}
            className={`px-2.5 py-1 border text-[11px] font-mono transition-all ${
              bgMode === 'tactical'
                ? 'bg-[#CCFF00] text-black border-black font-bold shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            TACTICAL
          </button>
          <button
            onClick={() => setBgMode('contrast')}
            className={`px-2.5 py-1 border text-[11px] font-mono transition-all ${
              bgMode === 'contrast'
                ? 'bg-[#CCFF00] text-black border-black font-bold shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            HIGH-CONTRAST
          </button>
          <button
            onClick={() => setBgMode('dark')}
            className={`px-2.5 py-1 border text-[11px] font-mono transition-all ${
              bgMode === 'dark'
                ? 'bg-[#CCFF00] text-black border-black font-bold shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            PITCH BLACK
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFiring(true);
              const r = 8 * (config.recoilMultiplier || 1.0);
              setBloom(r);
              if (onTriggerRecoil) onTriggerRecoil(r);
              setTimeout(() => {
                setBloom(0);
                setIsFiring(false);
              }, 180);
            }}
            className="brutal-btn py-1 px-3 text-[11px] bg-[#181B26] text-[#CCFF00] border-[#262A3B] hover:border-[#CCFF00]"
          >
            <Play size={10} className="fill-current" />
            SIMULATE SHOT
          </button>
        </div>
      </div>
    </div>
  );
}
