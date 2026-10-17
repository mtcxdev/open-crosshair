import React, { useState } from 'react';
import {
  Sliders,
  Circle,
  Plus,
  Shield,
  ChevronDown,
  Sparkles,
  RotateCw,
  Maximize2
} from 'lucide-react';
import {
  SliderControl,
  ToggleSwitch,
  SegmentedControl,
  ColorPickerRow
} from './PrecisionControls';

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

  // Standard esports high-visibility color swatches
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

  const tabOptions = [
    { id: 'lines', label: 'Arms', icon: Plus, enabled: lines.enabled },
    { id: 'dot', label: 'Dot', icon: Circle, enabled: dot.enabled },
    { id: 'ring', label: 'Ring', icon: Shield, enabled: ring.enabled },
    { id: 'chevron', label: 'Chevron', icon: ChevronDown, enabled: chevron.enabled },
    { id: 'transform', label: 'Dynamics', icon: Sliders, enabled: true },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] select-none w-full min-w-0 overflow-hidden">
      {/* Top Segmented Tab Switcher */}
      <div className="p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
        <div className="flex items-center gap-1 bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border-subtle)]">
          {tabOptions.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-semibold shadow-sm border border-[var(--border-subtle)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <Icon size={12} className={isActive ? 'stroke-[2.5]' : ''} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.enabled && tab.id !== 'transform' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 shadow-[0_0_4px_var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspector Scroll Area with Clean Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-5 text-xs">
        {/* ===================== TAB 1: ARMS ===================== */}
        {activeTab === 'lines' && (
          <div className="space-y-5">
            {/* Master Enable Row */}
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <ToggleSwitch
                label="Crosshair Arms"
                description="Four-directional precision reticle arms"
                checked={!!lines.enabled}
                onChange={(checked) => updateLayer('lines', { enabled: checked })}
              />
            </div>

            {lines.enabled && (
              <>
                {/* Arm Color */}
                <div className="pb-4 border-b border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="ARM COLOR"
                    color={lines.color || '#00FF66'}
                    onChange={(c) => updateLayer('lines', { color: c })}
                    presets={colorPresets}
                  />
                </div>

                {/* Geometry Sliders */}
                <div className="space-y-4 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Geometry
                  </div>

                  <SliderControl
                    label="Arm Length"
                    min={1}
                    max={32}
                    value={lines.length || 8}
                    onChange={(v) => updateLayer('lines', { length: v })}
                  />

                  <SliderControl
                    label="Thickness"
                    min={1}
                    max={16}
                    value={lines.thickness || 2}
                    onChange={(v) => updateLayer('lines', { thickness: v })}
                  />

                  <SliderControl
                    label="Center Gap"
                    min={0}
                    max={32}
                    value={lines.gap || 4}
                    onChange={(v) => updateLayer('lines', { gap: v })}
                  />

                  <SliderControl
                    label="Corner Rounding"
                    min={0}
                    max={8}
                    value={lines.borderRadius || 0}
                    onChange={(v) => updateLayer('lines', { borderRadius: v })}
                  />
                </div>

                {/* Outline Controls */}
                <div className="space-y-3 pb-4 border-b border-[var(--border-subtle)]">
                  <ToggleSwitch
                    label="Dark Outline"
                    description="High-contrast border for bright background visibility"
                    checked={!!lines.outline}
                    onChange={(checked) => updateLayer('lines', { outline: checked })}
                  />

                  {lines.outline && (
                    <SliderControl
                      label="Outline Width"
                      min={1}
                      max={4}
                      value={lines.outlineWidth || 1}
                      onChange={(v) => updateLayer('lines', { outlineWidth: v })}
                    />
                  )}
                </div>

                {/* T-Shape & Independent Arm Selectors */}
                <div className="space-y-3">
                  <ToggleSwitch
                    label="T-Shape Mode"
                    description="Removes top arm for unobstructed headshot visibility"
                    checked={!!lines.tShape}
                    onChange={(checked) => updateLayer('lines', { tShape: checked })}
                  />

                  <div className="pt-2">
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] block mb-2">
                      Active Arm Directions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'top', label: 'Top Arm', disabled: lines.tShape },
                        { key: 'bottom', label: 'Bottom Arm' },
                        { key: 'left', label: 'Left Arm' },
                        { key: 'right', label: 'Right Arm' },
                      ].map(({ key, label, disabled }) => {
                        const isActive = lines[key] !== false && (!disabled || key !== 'top');
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={disabled}
                            onClick={() => updateLayer('lines', { [key]: !isActive })}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              disabled
                                ? 'opacity-30 border-[var(--border-subtle)] cursor-not-allowed'
                                : isActive
                                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-main)] font-semibold'
                                : 'bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            <span>{label}</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isActive ? 'bg-[var(--accent)] shadow-[0_0_4px_var(--accent)]' : 'bg-neutral-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 2: CENTER DOT ===================== */}
        {activeTab === 'dot' && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <ToggleSwitch
                label="Center Dot"
                description="Precision focal reticle for hipfire and flick tracking"
                checked={!!dot.enabled}
                onChange={(checked) => updateLayer('dot', { enabled: checked })}
              />
            </div>

            {dot.enabled && (
              <>
                {/* Dot Shape */}
                <div className="space-y-2 pb-4 border-b border-[var(--border-subtle)]">
                  <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Dot Shape
                  </span>
                  <SegmentedControl
                    value={dot.shape === 'square' ? 'square' : 'circle'}
                    onChange={(shape) => updateLayer('dot', { shape })}
                    options={[
                      { value: 'circle', label: 'Smooth Circle' },
                      { value: 'square', label: 'Pixel Square' },
                    ]}
                  />
                </div>

                {/* Dot Color */}
                <div className="pb-4 border-b border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="DOT COLOR"
                    color={dot.color || '#00FF66'}
                    onChange={(c) => updateLayer('dot', { color: c })}
                    presets={colorPresets}
                  />
                </div>

                {/* Dot Size */}
                <div className="space-y-4 pb-4 border-b border-[var(--border-subtle)]">
                  <SliderControl
                    label="Dot Radius / Size"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={dot.size || 2}
                    onChange={(v) => updateLayer('dot', { size: v })}
                  />
                </div>

                {/* Dot Outline */}
                <div className="space-y-3">
                  <ToggleSwitch
                    label="Dot Outline"
                    description="Black contrast ring around center dot"
                    checked={!!dot.outline}
                    onChange={(checked) => updateLayer('dot', { outline: checked })}
                  />

                  {dot.outline && (
                    <SliderControl
                      label="Outline Width"
                      min={1}
                      max={3}
                      value={dot.outlineWidth || 1}
                      onChange={(v) => updateLayer('dot', { outlineWidth: v })}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 3: RING ===================== */}
        {activeTab === 'ring' && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <ToggleSwitch
                label="Reticle Ring"
                description="Outer framing circle for shotguns and hipfire tracking"
                checked={!!ring.enabled}
                onChange={(checked) => updateLayer('ring', { enabled: checked })}
              />
            </div>

            {ring.enabled && (
              <>
                <div className="pb-4 border-b border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="RING COLOR"
                    color={ring.color || '#00FF66'}
                    onChange={(c) => updateLayer('ring', { color: c })}
                    presets={colorPresets}
                  />
                </div>

                <div className="space-y-4 pb-4 border-b border-[var(--border-subtle)]">
                  <SliderControl
                    label="Ring Radius"
                    min={4}
                    max={40}
                    value={ring.radius || 12}
                    onChange={(v) => updateLayer('ring', { radius: v })}
                  />

                  <SliderControl
                    label="Ring Thickness"
                    min={1}
                    max={8}
                    value={ring.thickness || 2}
                    onChange={(v) => updateLayer('ring', { thickness: v })}
                  />
                </div>

                <div className="space-y-3">
                  <ToggleSwitch
                    label="Dashed Segments"
                    description="Segmented tactical perimeter ring"
                    checked={!!ring.dashed}
                    onChange={(checked) => updateLayer('ring', { dashed: checked })}
                  />

                  <ToggleSwitch
                    label="Center Fill Tint"
                    description="Semi-transparent inner tint"
                    checked={!!ring.fill}
                    onChange={(checked) => updateLayer('ring', { fill: checked })}
                  />

                  {ring.fill && (
                    <SliderControl
                      label="Fill Opacity"
                      min={5}
                      max={100}
                      unit="%"
                      value={Math.round((ring.fillOpacity || 0.2) * 100)}
                      onChange={(v) => updateLayer('ring', { fillOpacity: v / 100 })}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 4: CHEVRON ===================== */}
        {activeTab === 'chevron' && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <ToggleSwitch
                label="Tactical Chevron"
                description="Angled optic chevron arrow indicator"
                checked={!!chevron.enabled}
                onChange={(checked) => updateLayer('chevron', { enabled: checked })}
              />
            </div>

            {chevron.enabled && (
              <div className="space-y-4">
                <SliderControl
                  label="Chevron Size"
                  min={3}
                  max={20}
                  value={chevron.size || 8}
                  onChange={(v) => updateLayer('chevron', { size: v })}
                />

                <SliderControl
                  label="Thickness"
                  min={1}
                  max={6}
                  value={chevron.thickness || 2}
                  onChange={(v) => updateLayer('chevron', { thickness: v })}
                />

                <SliderControl
                  label="Vertical Shift"
                  min={-20}
                  max={20}
                  value={chevron.offsetY || 0}
                  onChange={(v) => updateLayer('chevron', { offsetY: v })}
                />

                <div className="pt-2">
                  <ToggleSwitch
                    label="Invert to V-Shape"
                    description="Flip chevron orientation downwards"
                    checked={!!chevron.inverted}
                    onChange={(checked) => updateLayer('chevron', { inverted: checked })}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: DYNAMICS & TRANSFORM ===================== */}
        {activeTab === 'transform' && (
          <div className="space-y-5">
            {/* Global Scale & Rotation */}
            <div className="space-y-4 pb-4 border-b border-[var(--border-subtle)]">
              <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Scale & Orientation
              </div>

              <SliderControl
                label="Global Scale"
                min={0.5}
                max={3.0}
                step={0.05}
                unit="x"
                value={config.scale || 1.0}
                onChange={(v) => updateRoot('scale', v)}
              />

              <SliderControl
                label="Rotation Angle"
                min={0}
                max={360}
                step={5}
                unit="°"
                value={config.rotation || 0}
                onChange={(v) => updateRoot('rotation', v)}
              />
            </div>

            {/* Firing Bloom & Recoil Dynamics */}
            <div className="space-y-3 pb-4 border-b border-[var(--border-subtle)]">
              <div className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Dynamic Recoil & Bloom
              </div>

              <SliderControl
                label="Bloom Multiplier"
                min={0}
                max={3.0}
                step={0.1}
                unit="x"
                value={config.recoilMultiplier || 1.0}
                onChange={(v) => updateRoot('recoilMultiplier', v)}
              />
              <span className="text-[11px] text-[var(--text-tertiary)] block">
                Crosshair arms dynamically expand outward during rapid weapon fire or movement.
              </span>
            </div>

            {/* Subpixel Centering Nudge */}
            <div className="space-y-3 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Center Calibration
                </span>
                {(config.offsetX !== 0 || config.offsetY !== 0) && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...config, offsetX: 0, offsetY: 0 })}
                    className="text-[11px] text-[var(--accent)] hover:underline font-medium"
                  >
                    Reset (0, 0)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SliderControl
                  label="X Shift"
                  min={-40}
                  max={40}
                  value={config.offsetX || 0}
                  onChange={(v) => updateRoot('offsetX', v)}
                />
                <SliderControl
                  label="Y Shift"
                  min={-40}
                  max={40}
                  value={config.offsetY || 0}
                  onChange={(v) => updateRoot('offsetY', v)}
                />
              </div>
            </div>

            {/* Outer Glow & Shadow */}
            <div className="space-y-3">
              <ToggleSwitch
                label="Glow & Shadow"
                description="Ambient drop shadow for maximum clarity against complex game textures"
                checked={!!shadow.enabled}
                onChange={(checked) => updateRoot('shadow', { ...shadow, enabled: checked })}
              />

              {shadow.enabled && (
                <SliderControl
                  label="Blur Radius"
                  min={1}
                  max={10}
                  value={shadow.blur || 2}
                  onChange={(v) => updateRoot('shadow', { ...shadow, blur: v })}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
