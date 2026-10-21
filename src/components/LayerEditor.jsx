import React, { useState } from 'react';
import {
  Sliders,
  Circle,
  Plus,
  Shield,
  ChevronDown,
} from 'lucide-react';
import {
  SliderControl,
  ToggleSwitch,
  SegmentedControl,
  ColorPickerRow
} from './PrecisionControls';

export function LayerEditor({ config, onChange }) {
  const [activeTab, setActiveTab] = useState('lines');

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

  // Standard high-visibility esports colors
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
    { id: 'transform', label: 'Scale & Move', icon: Sliders, enabled: true },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] select-none w-full min-w-0 overflow-hidden">
      {/* Top Tab Switcher */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
        <div className="flex items-center gap-1.5 bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border-subtle)]">
          {tabOptions.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-bold shadow-sm border border-[var(--border-subtle)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <Icon size={14} className={isActive ? 'stroke-[2.5]' : ''} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.enabled && tab.id !== 'transform' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 shadow-[0_0_4px_var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspector Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 text-xs">
        {/* ===================== TAB 1: ARMS ===================== */}
        {activeTab === 'lines' && (
          <div className="space-y-4">
            {/* Master Toggle & Color */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <ToggleSwitch
                label="Crosshair Lines"
                description="Show main reticle cross arms"
                checked={!!lines.enabled}
                onChange={(checked) => updateLayer('lines', { enabled: checked })}
              />

              {lines.enabled && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="Color"
                    color={lines.color || '#00FF66'}
                    onChange={(c) => updateLayer('lines', { color: c })}
                    presets={colorPresets}
                  />
                </div>
              )}
            </div>

            {lines.enabled && (
              <>
                {/* Geometry Card */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-4">
                  <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                    Size & Dimensions
                  </div>

                  <SliderControl
                    label="Length"
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

                {/* Outline Card */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
                  <ToggleSwitch
                    label="Black Outline"
                    description="High-contrast border for bright backgrounds"
                    checked={!!lines.outline}
                    onChange={(checked) => updateLayer('lines', { outline: checked })}
                  />

                  {lines.outline && (
                    <SliderControl
                      label="Outline Thickness"
                      min={1}
                      max={4}
                      value={lines.outlineWidth || 1}
                      onChange={(v) => updateLayer('lines', { outlineWidth: v })}
                    />
                  )}
                </div>

                {/* Direction & T-Shape Card */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
                  <ToggleSwitch
                    label="T-Shape Mode"
                    description="Removes top arm for clear headshot visibility"
                    checked={!!lines.tShape}
                    onChange={(checked) => updateLayer('lines', { tShape: checked })}
                  />

                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-2.5">
                      Toggle Individual Arms
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
                            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              disabled
                                ? 'opacity-30 border-[var(--border-subtle)] cursor-not-allowed'
                                : isActive
                                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-main)] font-bold'
                                : 'bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            <span>{label}</span>
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isActive ? 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]' : 'bg-neutral-600'
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
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <ToggleSwitch
                label="Center Dot"
                description="Small focal point in the middle"
                checked={!!dot.enabled}
                onChange={(checked) => updateLayer('dot', { enabled: checked })}
              />

              {dot.enabled && (
                <>
                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] block">
                      Dot Shape
                    </span>
                    <SegmentedControl
                      value={dot.shape === 'square' ? 'square' : 'circle'}
                      onChange={(shape) => updateLayer('dot', { shape })}
                      options={[
                        { value: 'circle', label: 'Round Dot' },
                        { value: 'square', label: 'Pixel Square' },
                      ]}
                    />
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <ColorPickerRow
                      label="Color"
                      color={dot.color || '#00FF66'}
                      onChange={(c) => updateLayer('dot', { color: c })}
                      presets={colorPresets}
                    />
                  </div>
                </>
              )}
            </div>

            {dot.enabled && (
              <>
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-4">
                  <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                    Dot Size
                  </div>

                  <SliderControl
                    label="Radius / Size"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={dot.size || 2}
                    onChange={(v) => updateLayer('dot', { size: v })}
                  />
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
                  <ToggleSwitch
                    label="Black Outline"
                    description="Contrast ring around center dot"
                    checked={!!dot.outline}
                    onChange={(checked) => updateLayer('dot', { outline: checked })}
                  />

                  {dot.outline && (
                    <SliderControl
                      label="Outline Thickness"
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
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <ToggleSwitch
                label="Center Ring"
                description="Circular reticle ring"
                checked={!!ring.enabled}
                onChange={(checked) => updateLayer('ring', { enabled: checked })}
              />

              {ring.enabled && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="Color"
                    color={ring.color || '#00FF66'}
                    onChange={(c) => updateLayer('ring', { color: c })}
                    presets={colorPresets}
                  />
                </div>
              )}
            </div>

            {ring.enabled && (
              <>
                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-4">
                  <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                    Ring Dimensions
                  </div>

                  <SliderControl
                    label="Ring Radius"
                    min={4}
                    max={40}
                    value={ring.radius || 12}
                    onChange={(v) => updateLayer('ring', { radius: v })}
                  />

                  <SliderControl
                    label="Thickness"
                    min={1}
                    max={8}
                    value={ring.thickness || 2}
                    onChange={(v) => updateLayer('ring', { thickness: v })}
                  />
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
                  <ToggleSwitch
                    label="Dashed Style"
                    description="Broken tactical dashes"
                    checked={!!ring.dashed}
                    onChange={(checked) => updateLayer('ring', { dashed: checked })}
                  />

                  <ToggleSwitch
                    label="Inside Color Tint"
                    description="Semi-transparent circle tint"
                    checked={!!ring.fill}
                    onChange={(checked) => updateLayer('ring', { fill: checked })}
                  />

                  {ring.fill && (
                    <SliderControl
                      label="Tint Opacity"
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
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <ToggleSwitch
                label="Optic Chevron"
                description="Angled arrow reticle"
                checked={!!chevron.enabled}
                onChange={(checked) => updateLayer('chevron', { enabled: checked })}
              />

              {chevron.enabled && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <ToggleSwitch
                    label="Invert (V-Shape)"
                    description="Flip arrow downwards"
                    checked={!!chevron.inverted}
                    onChange={(checked) => updateLayer('chevron', { inverted: checked })}
                  />
                </div>
              )}
            </div>

            {chevron.enabled && (
              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-4">
                <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  Chevron Size & Position
                </div>

                <SliderControl
                  label="Size"
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
                  label="Height Shift"
                  min={-20}
                  max={20}
                  value={chevron.offsetY || 0}
                  onChange={(v) => updateLayer('chevron', { offsetY: v })}
                />
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: SCALE & MOVE ===================== */}
        {activeTab === 'transform' && (
          <div className="space-y-4">
            {/* Scale & Angle */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-4">
              <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                Overall Scale & Angle
              </div>

              <SliderControl
                label="Overall Size"
                min={0.5}
                max={3.0}
                step={0.05}
                unit="x"
                value={config.scale || 1.0}
                onChange={(v) => updateRoot('scale', v)}
              />

              <SliderControl
                label="Rotation"
                min={0}
                max={360}
                step={5}
                unit="°"
                value={config.rotation || 0}
                onChange={(v) => updateRoot('rotation', v)}
              />
            </div>

            {/* Recoil Bloom */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                Dynamic Recoil
              </div>

              <SliderControl
                label="Bloom Expansion"
                min={0}
                max={3.0}
                step={0.1}
                unit="x"
                value={config.recoilMultiplier || 1.0}
                onChange={(v) => updateRoot('recoilMultiplier', v)}
              />
              <span className="text-xs text-[var(--text-secondary)] block leading-relaxed">
                Reticle arms expand when clicking or firing weapons.
              </span>
            </div>

            {/* Centering Position */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  Screen Offset
                </span>
                {(config.offsetX !== 0 || config.offsetY !== 0) && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...config, offsetX: 0, offsetY: 0 })}
                    className="text-xs text-[var(--accent)] hover:underline font-bold cursor-pointer"
                  >
                    Reset (0, 0)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SliderControl
                  label="X (Horizontal)"
                  min={-40}
                  max={40}
                  value={config.offsetX || 0}
                  onChange={(v) => updateRoot('offsetX', v)}
                />
                <SliderControl
                  label="Y (Vertical)"
                  min={-40}
                  max={40}
                  value={config.offsetY || 0}
                  onChange={(v) => updateRoot('offsetY', v)}
                />
              </div>
            </div>

            {/* Drop Shadow */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3.5">
              <ToggleSwitch
                label="Drop Shadow"
                description="Dark shadow behind reticle for contrast"
                checked={!!shadow.enabled}
                onChange={(checked) => updateRoot('shadow', { ...shadow, enabled: checked })}
              />

              {shadow.enabled && (
                <SliderControl
                  label="Shadow Blur"
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
