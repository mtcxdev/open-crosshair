import React, { useState } from 'react';
import { Sliders, Circle, Plus, Shield, Sparkles, ChevronDown, Check, Eye, EyeOff } from 'lucide-react';

export function LayerEditor({ config, onChange }) {
  const [activeTab, setActiveTab] = useState('lines'); // 'lines' | 'dot' | 'ring' | 'chevron' | 'effects'

  const updateLayer = (layerName, changes) => {
    onChange({
      ...config,
      layers: {
        ...config.layers,
        [layerName]: {
          ...config.layers?.[layerName],
          ...changes,
        },
      },
    });
  };

  const updateRoot = (key, val) => {
    onChange({
      ...config,
      [key]: val,
    });
  };

  const lines = config.layers?.lines || {};
  const dot = config.layers?.dot || {};
  const ring = config.layers?.ring || {};
  const chevron = config.layers?.chevron || {};
  const shadow = config.shadow || {};

  return (
    <div className="flex flex-col h-full bg-[#12141C] border-l-2 border-[#262A3B] select-none">
      {/* Sub-Header Tabs */}
      <div className="flex border-b-2 border-[#262A3B] bg-[#0A0B0E] overflow-x-auto">
        <button
          onClick={() => setActiveTab('lines')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono font-bold tracking-wider transition-all border-r border-[#262A3B] ${
            activeTab === 'lines'
              ? 'bg-[#CCFF00] text-black shadow-[inset_0_-2px_0_#000]'
              : 'text-[#8E95A5] hover:text-white hover:bg-[#181B26]'
          }`}
        >
          <Plus size={13} />
          LINES
          {lines.enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('dot')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono font-bold tracking-wider transition-all border-r border-[#262A3B] ${
            activeTab === 'dot'
              ? 'bg-[#CCFF00] text-black shadow-[inset_0_-2px_0_#000]'
              : 'text-[#8E95A5] hover:text-white hover:bg-[#181B26]'
          }`}
        >
          <Circle size={12} />
          DOT
          {dot.enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('ring')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono font-bold tracking-wider transition-all border-r border-[#262A3B] ${
            activeTab === 'ring'
              ? 'bg-[#CCFF00] text-black shadow-[inset_0_-2px_0_#000]'
              : 'text-[#8E95A5] hover:text-white hover:bg-[#181B26]'
          }`}
        >
          <Shield size={12} />
          RING
          {ring.enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('chevron')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono font-bold tracking-wider transition-all border-r border-[#262A3B] ${
            activeTab === 'chevron'
              ? 'bg-[#CCFF00] text-black shadow-[inset_0_-2px_0_#000]'
              : 'text-[#8E95A5] hover:text-white hover:bg-[#181B26]'
          }`}
        >
          <ChevronDown size={14} />
          CHEVRON
          {chevron.enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono font-bold tracking-wider transition-all ${
            activeTab === 'effects'
              ? 'bg-[#CCFF00] text-black shadow-[inset_0_-2px_0_#000]'
              : 'text-[#8E95A5] hover:text-white hover:bg-[#181B26]'
          }`}
        >
          <Sparkles size={12} />
          DYNAMICS
        </button>
      </div>

      {/* Tab Panels Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {/* ===================== TAB 1: LINES / ARMS ===================== */}
        {activeTab === 'lines' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262A3B]">
              <span className="font-bold text-sm tracking-wide text-white">CROSSHAIR ARMS</span>
              <button
                onClick={() => updateLayer('lines', { enabled: !lines.enabled })}
                className={`brutal-btn py-1 px-2.5 text-[11px] ${
                  lines.enabled ? 'bg-[#CCFF00] text-black' : 'bg-[#181B26] text-[#8E95A5]'
                }`}
              >
                {lines.enabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {lines.enabled && (
              <>
                {/* Color Selector */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>COLOR</span>
                    <span className="text-white font-bold">{lines.color || '#00FF66'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={lines.color || '#00FF66'}
                      onChange={(e) => updateLayer('lines', { color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="brutal-input flex-1 uppercase"
                      value={lines.color || '#00FF66'}
                      onChange={(e) => updateLayer('lines', { color: e.target.value })}
                    />
                    {/* Quick Palette */}
                    <div className="flex gap-1">
                      {['#00FF66', '#00F0FF', '#CCFF00', '#FF0055', '#FFFFFF'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateLayer('lines', { color: c })}
                          className="w-6 h-6 border border-black"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Length */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>LENGTH</span>
                    <span className="text-[#CCFF00] font-bold">{lines.length || 8} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="32"
                    value={lines.length || 8}
                    onChange={(e) => updateLayer('lines', { length: Number(e.target.value) })}
                  />
                </div>

                {/* Thickness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>THICKNESS</span>
                    <span className="text-[#CCFF00] font-bold">{lines.thickness || 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={lines.thickness || 2}
                    onChange={(e) => updateLayer('lines', { thickness: Number(e.target.value) })}
                  />
                </div>

                {/* Center Gap */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>CENTER GAP</span>
                    <span className="text-[#CCFF00] font-bold">{lines.gap || 4} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    value={lines.gap || 4}
                    onChange={(e) => updateLayer('lines', { gap: Number(e.target.value) })}
                  />
                </div>

                {/* Corner Radius */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>CORNER ROUNDING</span>
                    <span className="text-[#CCFF00] font-bold">{lines.borderRadius || 0} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={lines.borderRadius || 0}
                    onChange={(e) => updateLayer('lines', { borderRadius: Number(e.target.value) })}
                  />
                </div>

                {/* Outline Controls */}
                <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">BLACK OUTLINE</span>
                    <button
                      onClick={() => updateLayer('lines', { outline: !lines.outline })}
                      className={`px-2 py-0.5 border text-[10px] ${
                        lines.outline ? 'bg-[#CCFF00] text-black font-bold' : 'bg-[#0A0B0E] text-[#8E95A5]'
                      }`}
                    >
                      {lines.outline ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {lines.outline && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#8E95A5]">
                        <span>OUTLINE THICKNESS</span>
                        <span className="text-white">{lines.outlineWidth || 1} px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={lines.outlineWidth || 1}
                        onChange={(e) => updateLayer('lines', { outlineWidth: Number(e.target.value) })}
                      />
                    </div>
                  )}
                </div>

                {/* Arm Toggles / T-Shape */}
                <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">T-SHAPE (HIDE TOP ARM)</span>
                    <input
                      type="checkbox"
                      checked={!!lines.tShape}
                      onChange={(e) => updateLayer('lines', { tShape: e.target.checked })}
                      className="w-4 h-4 accent-[#CCFF00] cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#262A3B] grid grid-cols-2 gap-2 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer text-[#8E95A5] hover:text-white">
                      <input
                        type="checkbox"
                        checked={lines.left !== false}
                        onChange={(e) => updateLayer('lines', { left: e.target.checked })}
                        className="accent-[#CCFF00]"
                      />
                      LEFT ARM
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[#8E95A5] hover:text-white">
                      <input
                        type="checkbox"
                        checked={lines.right !== false}
                        onChange={(e) => updateLayer('lines', { right: e.target.checked })}
                        className="accent-[#CCFF00]"
                      />
                      RIGHT ARM
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[#8E95A5] hover:text-white">
                      <input
                        type="checkbox"
                        checked={lines.top !== false && !lines.tShape}
                        disabled={lines.tShape}
                        onChange={(e) => updateLayer('lines', { top: e.target.checked })}
                        className="accent-[#CCFF00]"
                      />
                      TOP ARM
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[#8E95A5] hover:text-white">
                      <input
                        type="checkbox"
                        checked={lines.bottom !== false}
                        onChange={(e) => updateLayer('lines', { bottom: e.target.checked })}
                        className="accent-[#CCFF00]"
                      />
                      BOTTOM ARM
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 2: CENTER DOT ===================== */}
        {activeTab === 'dot' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262A3B]">
              <span className="font-bold text-sm tracking-wide text-white">CENTER DOT</span>
              <button
                onClick={() => updateLayer('dot', { enabled: !dot.enabled })}
                className={`brutal-btn py-1 px-2.5 text-[11px] ${
                  dot.enabled ? 'bg-[#CCFF00] text-black' : 'bg-[#181B26] text-[#8E95A5]'
                }`}
              >
                {dot.enabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {dot.enabled && (
              <>
                {/* Shape Selector */}
                <div className="space-y-1.5">
                  <span className="text-[#8E95A5]">DOT SHAPE</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateLayer('dot', { shape: 'circle' })}
                      className={`py-1.5 border text-center font-bold ${
                        dot.shape !== 'square'
                          ? 'bg-[#CCFF00] text-black border-black'
                          : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B]'
                      }`}
                    >
                      CIRCLE
                    </button>
                    <button
                      onClick={() => updateLayer('dot', { shape: 'square' })}
                      className={`py-1.5 border text-center font-bold ${
                        dot.shape === 'square'
                          ? 'bg-[#CCFF00] text-black border-black'
                          : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B]'
                      }`}
                    >
                      SQUARE
                    </button>
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>DOT COLOR</span>
                    <span className="text-white font-bold">{dot.color || '#00FF66'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={dot.color || '#00FF66'}
                      onChange={(e) => updateLayer('dot', { color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="brutal-input flex-1 uppercase"
                      value={dot.color || '#00FF66'}
                      onChange={(e) => updateLayer('dot', { color: e.target.value })}
                    />
                  </div>
                </div>

                {/* Radius / Size */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>DOT RADIUS / SIZE</span>
                    <span className="text-[#CCFF00] font-bold">{dot.size || 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={dot.size || 2}
                    onChange={(e) => updateLayer('dot', { size: Number(e.target.value) })}
                  />
                </div>

                {/* Dot Outline */}
                <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">DOT OUTLINE</span>
                    <button
                      onClick={() => updateLayer('dot', { outline: !dot.outline })}
                      className={`px-2 py-0.5 border text-[10px] ${
                        dot.outline ? 'bg-[#CCFF00] text-black font-bold' : 'bg-[#0A0B0E] text-[#8E95A5]'
                      }`}
                    >
                      {dot.outline ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {dot.outline && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#8E95A5]">
                        <span>OUTLINE THICKNESS</span>
                        <span className="text-white">{dot.outlineWidth || 1} px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        value={dot.outlineWidth || 1}
                        onChange={(e) => updateLayer('dot', { outlineWidth: Number(e.target.value) })}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 3: RING ===================== */}
        {activeTab === 'ring' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262A3B]">
              <span className="font-bold text-sm tracking-wide text-white">RING / CIRCLE</span>
              <button
                onClick={() => updateLayer('ring', { enabled: !ring.enabled })}
                className={`brutal-btn py-1 px-2.5 text-[11px] ${
                  ring.enabled ? 'bg-[#CCFF00] text-black' : 'bg-[#181B26] text-[#8E95A5]'
                }`}
              >
                {ring.enabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {ring.enabled && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>RING RADIUS</span>
                    <span className="text-[#CCFF00] font-bold">{ring.radius || 12} px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={ring.radius || 12}
                    onChange={(e) => updateLayer('ring', { radius: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>RING THICKNESS</span>
                    <span className="text-[#CCFF00] font-bold">{ring.thickness || 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={ring.thickness || 2}
                    onChange={(e) => updateLayer('ring', { thickness: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={ring.color || '#00FF66'}
                    onChange={(e) => updateLayer('ring', { color: e.target.value })}
                  />
                  <input
                    type="text"
                    className="brutal-input flex-1 uppercase"
                    value={ring.color || '#00FF66'}
                    onChange={(e) => updateLayer('ring', { color: e.target.value })}
                  />
                </div>

                {/* Dashed Option */}
                <div className="flex items-center justify-between p-3 bg-[#181B26] border border-[#262A3B]">
                  <span className="text-white font-bold">DASHED SEGMENTS</span>
                  <input
                    type="checkbox"
                    checked={!!ring.dashed}
                    onChange={(e) => updateLayer('ring', { dashed: e.target.checked })}
                    className="w-4 h-4 accent-[#CCFF00] cursor-pointer"
                  />
                </div>

                {/* Fill Option */}
                <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">CENTER FILL</span>
                    <input
                      type="checkbox"
                      checked={!!ring.fill}
                      onChange={(e) => updateLayer('ring', { fill: e.target.checked })}
                      className="w-4 h-4 accent-[#CCFF00] cursor-pointer"
                    />
                  </div>
                  {ring.fill && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#8E95A5]">
                        <span>FILL OPACITY</span>
                        <span className="text-white">{(ring.fillOpacity || 0.2).toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={ring.fillOpacity || 0.2}
                        onChange={(e) => updateLayer('ring', { fillOpacity: Number(e.target.value) })}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 4: CHEVRON ===================== */}
        {activeTab === 'chevron' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262A3B]">
              <span className="font-bold text-sm tracking-wide text-white">TACTICAL CHEVRON</span>
              <button
                onClick={() => updateLayer('chevron', { enabled: !chevron.enabled })}
                className={`brutal-btn py-1 px-2.5 text-[11px] ${
                  chevron.enabled ? 'bg-[#CCFF00] text-black' : 'bg-[#181B26] text-[#8E95A5]'
                }`}
              >
                {chevron.enabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {chevron.enabled && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>SIZE</span>
                    <span className="text-[#CCFF00] font-bold">{chevron.size || 8} px</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={chevron.size || 8}
                    onChange={(e) => updateLayer('chevron', { size: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>THICKNESS</span>
                    <span className="text-[#CCFF00] font-bold">{chevron.thickness || 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={chevron.thickness || 2}
                    onChange={(e) => updateLayer('chevron', { thickness: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>VERTICAL OFFSET</span>
                    <span className="text-[#CCFF00] font-bold">{chevron.offsetY || 0} px</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={chevron.offsetY || 0}
                    onChange={(e) => updateLayer('chevron', { offsetY: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#181B26] border border-[#262A3B]">
                  <span className="text-white font-bold">INVERT DIRECTION (V-SHAPE)</span>
                  <input
                    type="checkbox"
                    checked={!!chevron.inverted}
                    onChange={(e) => updateLayer('chevron', { inverted: e.target.checked })}
                    className="w-4 h-4 accent-[#CCFF00] cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 5: EFFECTS & DYNAMICS ===================== */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            <span className="font-bold text-sm tracking-wide text-white block pb-2 border-b border-[#262A3B]">
              POSITION, SCALE & DYNAMICS
            </span>

            {/* Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#8E95A5]">
                <span>GLOBAL SCALE</span>
                <span className="text-[#CCFF00] font-bold">{(config.scale || 1.0).toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={config.scale || 1.0}
                onChange={(e) => updateRoot('scale', Number(e.target.value))}
              />
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#8E95A5]">
                <span>ROTATION</span>
                <span className="text-[#CCFF00] font-bold">{config.rotation || 0}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={config.rotation || 0}
                onChange={(e) => updateRoot('rotation', Number(e.target.value))}
              />
            </div>

            {/* Recoil Expansion Multiplier */}
            <div className="space-y-1 p-3 bg-[#181B26] border border-[#262A3B]">
              <div className="flex justify-between text-[#8E95A5]">
                <span className="font-bold text-white">RECOIL BLOOM MULTIPLIER</span>
                <span className="text-[#CCFF00] font-bold">{(config.recoilMultiplier || 1.0).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.1"
                value={config.recoilMultiplier || 1.0}
                onChange={(e) => updateRoot('recoilMultiplier', Number(e.target.value))}
              />
              <span className="text-[10px] text-[#8E95A5] block">
                Controls how much the crosshair arms bloom outward upon firing.
              </span>
            </div>

            {/* X / Y Position Nudge */}
            <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
              <span className="font-bold text-white block">SCREEN CENTER NUDGE (PIXELS)</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8E95A5]">X-OFFSET: {config.offsetX || 0}px</span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={config.offsetX || 0}
                    onChange={(e) => updateRoot('offsetX', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8E95A5]">Y-OFFSET: {config.offsetY || 0}px</span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={config.offsetY || 0}
                    onChange={(e) => updateRoot('offsetY', Number(e.target.value))}
                  />
                </div>
              </div>
              <button
                onClick={() => onChange({ ...config, offsetX: 0, offsetY: 0 })}
                className="w-full text-center py-1 bg-[#0A0B0E] border border-[#262A3B] text-[#8E95A5] hover:text-[#CCFF00] text-[10px]"
              >
                RESET TO CENTER (0, 0)
              </button>
            </div>

            {/* Drop Shadow Glow */}
            <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">GLOW & SHADOW</span>
                <input
                  type="checkbox"
                  checked={!!shadow.enabled}
                  onChange={(e) => updateRoot('shadow', { ...shadow, enabled: e.target.checked })}
                  className="w-4 h-4 accent-[#CCFF00] cursor-pointer"
                />
              </div>
              {shadow.enabled && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>BLUR INTENSITY</span>
                    <span className="text-white">{shadow.blur || 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={shadow.blur || 2}
                    onChange={(e) => updateRoot('shadow', { ...shadow, blur: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
