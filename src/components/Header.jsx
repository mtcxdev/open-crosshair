import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Eye, EyeOff, Monitor, Radio, ShieldCheck } from 'lucide-react';

export function Header({ overlayEnabled, onToggleOverlay, displays, selectedDisplayId, onSelectDisplay }) {
  const isElectron = !!window.api;

  return (
    <header className="h-12 border-b-2 border-[#262A3B] bg-[#0A0B0E] flex items-center justify-between px-3 select-none" style={{ WebkitAppRegion: 'drag' }}>
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#CCFF00] border border-black shadow-[2px_2px_0px_#000]"></div>
          <span className="font-mono font-extrabold text-sm tracking-wider text-[#F3F4F6]">
            OPEN<span className="text-[#CCFF00]">CROSSHAIR</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#181B26] border border-[#262A3B] text-[#8E95A5]">
            v1.0.0
          </span>
        </div>

        <div className="h-4 w-[1px] bg-[#262A3B] mx-1"></div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#CCFF00]">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
          <span>100% OFFLINE</span>
        </div>
      </div>

      {/* Center: Controls (Overlay Toggle & Monitor Select) */}
      <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Overlay Toggle Switch */}
        <button
          onClick={onToggleOverlay}
          className={`brutal-btn py-1 px-3 text-xs flex items-center gap-1.5 ${
            overlayEnabled ? 'bg-[#CCFF00] text-black' : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B]'
          }`}
          title="Toggle Screen Overlay (Ctrl+Shift+X)"
        >
          {overlayEnabled ? <Eye size={13} className="stroke-[2.5]" /> : <EyeOff size={13} />}
          <span>OVERLAY: {overlayEnabled ? 'ACTIVE' : 'MUTED'}</span>
        </button>

        {/* Display Selector */}
        {displays && displays.length > 1 && (
          <div className="flex items-center gap-1.5 bg-[#12141C] border border-[#262A3B] px-2 py-1 text-xs font-mono">
            <Monitor size={12} className="text-[#8E95A5]" />
            <select
              value={selectedDisplayId || ''}
              onChange={(e) => onSelectDisplay(Number(e.target.value))}
              className="bg-transparent text-[#F3F4F6] text-xs font-mono outline-none cursor-pointer"
            >
              {displays.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#12141C] text-[#F3F4F6]">
                  {d.label} {d.isPrimary ? '[PRI]' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={() => isElectron && window.api.minimize()}
          className="w-8 h-8 flex items-center justify-center border border-[#262A3B] bg-[#12141C] hover:bg-[#202433] text-[#8E95A5] hover:text-[#F3F4F6] transition-colors"
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={() => isElectron && window.api.maximize()}
          className="w-8 h-8 flex items-center justify-center border border-[#262A3B] bg-[#12141C] hover:bg-[#202433] text-[#8E95A5] hover:text-[#F3F4F6] transition-colors"
          title="Maximize"
        >
          <Square size={12} />
        </button>
        <button
          onClick={() => isElectron && window.api.close()}
          className="w-8 h-8 flex items-center justify-center border border-[#262A3B] bg-[#12141C] hover:bg-[#FF0055] hover:text-white text-[#8E95A5] transition-colors"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>
    </header>
  );
}
