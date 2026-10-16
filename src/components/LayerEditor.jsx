import React, { useState } from 'react';
import {
  Sliders,
  Circle,
  Plus,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Move,
  RotateCw,
  Palette,
  Maximize2
} from 'lucide-react';

export function LayerEditor({ config, onChange }) {
  const [activeTab, setActiveTab] = useState('lines'); // 'lines' | 'dot' | 'ring' | 'chevron' | 'transform'

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

  // Standard esport color swatches
  const colorPresets = [
    '#00FF66', // Tactical Green
    '#00F0FF', // Cyber Cyan
    '#CCFF00', // Neon Lime
    '#FF0055', // Hot Magenta
    '#FFFFFF', // Pure White
    '#FFB703', // Amber Gold
    '#FB8500', // Sunset Orange
    '#7209B7', // Royal Purple
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] select-none w-full">
      {/* Top Layer Segmented Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveTab('lines')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'lines'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Plus size={13} className="stroke-[2.5]" />
          <span>Arms</span>
          {lines.enabled && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </button>

        <button
          onClick={() => setActiveTab('dot')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'dot'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Circle size={12} className="stroke-[2.5]" />
          <span>Dot</span>
          {dot.enabled && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </button>

        <button
          onClick={() => setActiveTab('ring')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'ring'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Shield size={12} />
          <span>Ring</span>
          {ring.enabled && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </button>

        <button
          onClick={() => setActiveTab('chevron')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'chevron'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <ChevronDown size={13} className="stroke-[2.5]" />
          <span>Chevron</span>
          {chevron.enabled && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </button>

        <button
          onClick={() => setActiveTab('transform')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'transform'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Sliders size={12} />
          <span>Dynamics</span>
        </button>
      </div>

      {/* Main Inspector Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ===================== TAB 1: ARMS (LINES) ===================== */}
        {activeTab === 'lines' && (
          <div className="space-y-4">
            {/* Layer Master Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div>
                <span className="font-semibold text-sm text-[var(--text-main)] block">Crosshair Arms</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Four-directional directional reticle</span>
              </div>
              <button
                onClick={() => updateLayer('lines', { enabled: !lines.enabled })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  lines.enabled
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                    : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                {lines.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {lines.enabled && (
              <>
                {/* Color & Opacity Section */}
                <div className="space-y-3 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-secondary)]">
                    <span>ARM COLOR</span>
                    <span className="font-mono text-[var(--text-main)]">{lines.color || '#00FF66'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={lines.color || '#00FF66'}
                      onChange={(e) => updateLayer('lines', { color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="input-text flex-1 uppercase font-mono text-xs"
                      value={lines.color || '#00FF66'}
                      onChange={(e) => updateLayer('lines', { color: e.target.value })}
                    />
                  </div>

                  {/* Swatch Quick Selector */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    {colorPresets.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateLayer('lines', { color: c })}
                        className={`w-6 h-6 rounded-md border transition-transform ${
                          lines.color === c ? 'scale-115 border-white shadow-sm' : 'border-black/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Geometry Sliders with Numeric Input */}
                <div className="space-y-4 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  {/* Length */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Length</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="32"
                          value={lines.length || 8}
                          onChange={(e) => updateLayer('lines', { length: Math.max(1, Number(e.target.value)) })}
                          className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                        />
                        <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                      </div>
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
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Thickness</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="16"
                          value={lines.thickness || 2}
                          onChange={(e) => updateLayer('lines', { thickness: Math.max(1, Number(e.target.value)) })}
                          className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                        />
                        <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="16"
                      value={lines.thickness || 2}
                      onChange={(e) => updateLayer('lines', { thickness: Number(e.target.value) })}
                    />
                  </div>

                  {/* Center Gap */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Center Gap</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="32"
                          value={lines.gap || 4}
                          onChange={(e) => updateLayer('lines', { gap: Math.max(0, Number(e.target.value)) })}
                          className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                        />
                        <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={lines.gap || 4}
                      onChange={(e) => updateLayer('lines', { gap: Number(e.target.value) })}
                    />
                  </div>

                  {/* Corner Radius */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Corner Rounding</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="8"
                          value={lines.borderRadius || 0}
                          onChange={(e) => updateLayer('lines', { borderRadius: Math.max(0, Number(e.target.value)) })}
                          className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                        />
                        <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={lines.borderRadius || 0}
                      onChange={(e) => updateLayer('lines', { borderRadius: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Outline Controls */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[var(--text-main)] block">Black Outline</span>
                      <span className="text-[11px] text-[var(--text-tertiary)]">Enhances visibility over bright areas</span>
                    </div>
                    <button
                      onClick={() => updateLayer('lines', { outline: !lines.outline })}
                      className={`px-2.5 py-0.8 rounded-full text-[11px] font-medium transition-all ${
                        lines.outline
                          ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                          : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {lines.outline ? 'On' : 'Off'}
                    </button>
                  </div>

                  {lines.outline && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>Outline Width</span>
                        <span className="font-mono text-[var(--text-main)]">{lines.outlineWidth || 1} px</span>
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

                {/* T-Shape & Arm Selectors */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[var(--text-main)] block">T-Shape Mode</span>
                      <span className="text-[11px] text-[var(--text-tertiary)]">Removes top arm for clear head visibility</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!lines.tShape}
                      onChange={(e) => updateLayer('lines', { tShape: e.target.checked })}
                      className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-main)]">
                      <input
                        type="checkbox"
                        checked={lines.left !== false}
                        onChange={(e) => updateLayer('lines', { left: e.target.checked })}
                        className="rounded accent-[var(--accent)]"
                      />
                      <span>Left Arm</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-main)]">
                      <input
                        type="checkbox"
                        checked={lines.right !== false}
                        onChange={(e) => updateLayer('lines', { right: e.target.checked })}
                        className="rounded accent-[var(--accent)]"
                      />
                      <span>Right Arm</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-main)]">
                      <input
                        type="checkbox"
                        checked={lines.top !== false && !lines.tShape}
                        disabled={lines.tShape}
                        onChange={(e) => updateLayer('lines', { top: e.target.checked })}
                        className="rounded accent-[var(--accent)] disabled:opacity-30"
                      />
                      <span>Top Arm</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-main)]">
                      <input
                        type="checkbox"
                        checked={lines.bottom !== false}
                        onChange={(e) => updateLayer('lines', { bottom: e.target.checked })}
                        className="rounded accent-[var(--accent)]"
                      />
                      <span>Bottom Arm</span>
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div>
                <span className="font-semibold text-sm text-[var(--text-main)] block">Center Dot</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Precision focal point for hipfire & tracking</span>
              </div>
              <button
                onClick={() => updateLayer('dot', { enabled: !dot.enabled })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  dot.enabled
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                    : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                {dot.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {dot.enabled && (
              <>
                {/* Shape Selector */}
                <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">DOT SHAPE</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateLayer('dot', { shape: 'circle' })}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        dot.shape !== 'square'
                          ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)] font-semibold'
                          : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      Circular
                    </button>
                    <button
                      onClick={() => updateLayer('dot', { shape: 'square' })}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        dot.shape === 'square'
                          ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)] font-semibold'
                          : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      Square / Pixel
                    </button>
                  </div>
                </div>

                {/* Dot Color */}
                <div className="space-y-3 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-secondary)]">
                    <span>DOT COLOR</span>
                    <span className="font-mono text-[var(--text-main)]">{dot.color || '#00FF66'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={dot.color || '#00FF66'}
                      onChange={(e) => updateLayer('dot', { color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="input-text flex-1 uppercase font-mono text-xs"
                      value={dot.color || '#00FF66'}
                      onChange={(e) => updateLayer('dot', { color: e.target.value })}
                    />
                  </div>
                </div>

                {/* Dot Radius / Size */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Dot Radius</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={dot.size || 2}
                        onChange={(e) => updateLayer('dot', { size: Math.max(0.5, Number(e.target.value)) })}
                        className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                      />
                      <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={dot.size || 2}
                    onChange={(e) => updateLayer('dot', { size: Number(e.target.value) })}
                  />
                </div>

                {/* Dot Outline */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[var(--text-main)]">Dot Outline</span>
                    <button
                      onClick={() => updateLayer('dot', { outline: !dot.outline })}
                      className={`px-2.5 py-0.8 rounded-full text-[11px] font-medium transition-all ${
                        dot.outline
                          ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                          : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {dot.outline ? 'On' : 'Off'}
                    </button>
                  </div>
                  {dot.outline && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>Outline Width</span>
                        <span className="font-mono text-[var(--text-main)]">{dot.outlineWidth || 1} px</span>
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div>
                <span className="font-semibold text-sm text-[var(--text-main)] block">Reticle Ring</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Circular framing reticle for shotguns & hipfire</span>
              </div>
              <button
                onClick={() => updateLayer('ring', { enabled: !ring.enabled })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  ring.enabled
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                    : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                {ring.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {ring.enabled && (
              <>
                <div className="space-y-4 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  {/* Radius */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Radius</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="4"
                          max="40"
                          value={ring.radius || 12}
                          onChange={(e) => updateLayer('ring', { radius: Math.max(4, Number(e.target.value)) })}
                          className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                        />
                        <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={ring.radius || 12}
                      onChange={(e) => updateLayer('ring', { radius: Number(e.target.value) })}
                    />
                  </div>

                  {/* Thickness */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Thickness</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={ring.thickness || 2}
                          onChange={(e) => updateLayer('ring', { thickness: Math.max(1, Number(e.target.value)) })}
                          className="w-12 text-right input-text py-0.5 px-1 font-mono text-xs"
                        />
                        <span className="text-[10px] text-[var(--text-tertiary)]">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={ring.thickness || 2}
                      onChange={(e) => updateLayer('ring', { thickness: Number(e.target.value) })}
                    />
                  </div>

                  {/* Color */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={ring.color || '#00FF66'}
                      onChange={(e) => updateLayer('ring', { color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="input-text flex-1 uppercase font-mono text-xs"
                      value={ring.color || '#00FF66'}
                      onChange={(e) => updateLayer('ring', { color: e.target.value })}
                    />
                  </div>
                </div>

                {/* Dashed Option */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div>
                    <span className="font-semibold text-xs text-[var(--text-main)] block">Dashed Segments</span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">Segmented tactical circle</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!ring.dashed}
                    onChange={(e) => updateLayer('ring', { dashed: e.target.checked })}
                    className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                {/* Fill Option */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[var(--text-main)] block">Center Fill Tint</span>
                      <span className="text-[11px] text-[var(--text-tertiary)]">Semi-transparent center highlight</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!ring.fill}
                      onChange={(e) => updateLayer('ring', { fill: e.target.checked })}
                      className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                    />
                  </div>
                  {ring.fill && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>Fill Opacity</span>
                        <span className="font-mono text-[var(--text-main)]">{Math.round((ring.fillOpacity || 0.2) * 100)}%</span>
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div>
                <span className="font-semibold text-sm text-[var(--text-main)] block">Tactical Chevron</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Angled optic chevron arrow indicator</span>
              </div>
              <button
                onClick={() => updateLayer('chevron', { enabled: !chevron.enabled })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  chevron.enabled
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                    : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                {chevron.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {chevron.enabled && (
              <div className="space-y-4 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                {/* Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Chevron Size</span>
                    <span className="font-mono text-[var(--text-main)]">{chevron.size || 8} px</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={chevron.size || 8}
                    onChange={(e) => updateLayer('chevron', { size: Number(e.target.value) })}
                  />
                </div>

                {/* Thickness */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Thickness</span>
                    <span className="font-mono text-[var(--text-main)]">{chevron.thickness || 2} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={chevron.thickness || 2}
                    onChange={(e) => updateLayer('chevron', { thickness: Number(e.target.value) })}
                  />
                </div>

                {/* Vertical Offset */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Vertical Shift</span>
                    <span className="font-mono text-[var(--text-main)]">{chevron.offsetY || 0} px</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={chevron.offsetY || 0}
                    onChange={(e) => updateLayer('chevron', { offsetY: Number(e.target.value) })}
                  />
                </div>

                {/* Invert */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--text-secondary)]">Invert to V-Shape</span>
                  <input
                    type="checkbox"
                    checked={!!chevron.inverted}
                    onChange={(e) => updateLayer('chevron', { inverted: e.target.checked })}
                    className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: DYNAMICS & TRANSFORM ===================== */}
        {activeTab === 'transform' && (
          <div className="space-y-4">
            {/* Global Scale & Rotation */}
            <div className="space-y-4 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] block">SCALE & ROTATION</span>

              {/* Global Scale */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Global Size Scale</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      value={config.scale || 1.0}
                      onChange={(e) => updateRoot('scale', Math.max(0.2, Number(e.target.value)))}
                      className="w-14 text-right input-text py-0.5 px-1 font-mono text-xs"
                    />
                    <span className="text-[10px] text-[var(--text-tertiary)]">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={config.scale || 1.0}
                  onChange={(e) => updateRoot('scale', Number(e.target.value))}
                />
              </div>

              {/* Rotation Angle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Rotation Angle</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={config.rotation || 0}
                      onChange={(e) => updateRoot('rotation', (Number(e.target.value) % 360 + 360) % 360)}
                      className="w-14 text-right input-text py-0.5 px-1 font-mono text-xs"
                    />
                    <span className="text-[10px] text-[var(--text-tertiary)]">&deg;</span>
                  </div>
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
            </div>

            {/* Firing Bloom & Recoil Dynamics */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] block">RECOIL DYNAMICS</span>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Bloom Expansion Multiplier</span>
                <span className="font-mono text-[var(--accent)] font-semibold">{(config.recoilMultiplier || 1.0).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.1"
                value={config.recoilMultiplier || 1.0}
                onChange={(e) => updateRoot('recoilMultiplier', Number(e.target.value))}
              />
              <span className="text-[11px] text-[var(--text-tertiary)] block">
                Controls how far crosshair arms expand outwards during rapid weapon fire.
              </span>
            </div>

            {/* Subpixel Centering Nudge */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--text-secondary)]">CENTER CALIBRATION</span>
                {(config.offsetX !== 0 || config.offsetY !== 0) && (
                  <button
                    onClick={() => onChange({ ...config, offsetX: 0, offsetY: 0 })}
                    className="text-[11px] text-[var(--accent)] hover:underline"
                  >
                    Reset (0, 0)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>X Offset</span>
                    <span className="font-mono text-[var(--text-main)]">{config.offsetX || 0} px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={config.offsetX || 0}
                    onChange={(e) => updateRoot('offsetX', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Y Offset</span>
                    <span className="font-mono text-[var(--text-main)]">{config.offsetY || 0} px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={config.offsetY || 0}
                    onChange={(e) => updateRoot('offsetY', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Drop Shadow & Glow */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-main)] block">Glow & Shadow</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">Adds soft outer ambient contrast</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!shadow.enabled}
                  onChange={(e) => updateRoot('shadow', { ...shadow, enabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                />
              </div>
              {shadow.enabled && (
                <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Blur Radius</span>
                    <span className="font-mono text-[var(--text-main)]">{shadow.blur || 2} px</span>
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
