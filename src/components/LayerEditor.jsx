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
  ColorPickerRow,
  DirectionalArmsSelector,
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

  const tabs = [
    { id: 'lines', label: 'Arms', icon: Plus, enabled: lines.enabled },
    { id: 'dot', label: 'Dot', icon: Circle, enabled: dot.enabled },
    { id: 'ring', label: 'Ring', icon: Shield, enabled: ring.enabled },
    { id: 'chevron', label: 'Chevron', icon: ChevronDown, enabled: chevron.enabled },
    { id: 'transform', label: 'Transform', icon: Sliders, enabled: true },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] select-none w-full min-w-0 overflow-hidden">
      {/* Top Inspector Tab Switcher */}
      <div className="p-4 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2 bg-[var(--bg-input)] p-1.5 rounded-2xl border border-[var(--border-subtle)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm border border-[var(--border-medium)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Icon size={14} className={isActive ? 'stroke-[2.5]' : ''} />
                <span>{tab.label}</span>
                {tab.enabled && tab.id !== 'transform' && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 shadow-[0_0_6px_var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspector Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 text-xs">
        {/* ===================== TAB 1: ARMS ===================== */}
        {activeTab === 'lines' && (
          <div className="space-y-6">
            {/* Master Toggle & Color */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
              <ToggleSwitch
                label="Crosshair Lines"
                description="Show main reticle cross arms"
                checked={!!lines.enabled}
                onChange={(checked) => updateLayer('lines', { enabled: checked })}
              />

              {lines.enabled && (
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="Arm Color"
                    color={lines.color || '#00FF66'}
                    onChange={(c) => updateLayer('lines', { color: c })}
                    presets={colorPresets}
                  />
                </div>
              )}
            </div>

            {lines.enabled && (
              <>
                {/* Dimensions Card */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-5 pb-3 border-b border-[var(--border-subtle)]">
                    Dimensions
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
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
                  <ToggleSwitch
                    label="Black Outline"
                    description="High-contrast border for bright backgrounds"
                    checked={!!lines.outline}
                    onChange={(checked) => updateLayer('lines', { outline: checked })}
                  />

                  {lines.outline && (
                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                      <SliderControl
                        label="Outline Thickness"
                        min={1}
                        max={4}
                        value={lines.outlineWidth || 1}
                        onChange={(v) => updateLayer('lines', { outlineWidth: v })}
                      />
                    </div>
                  )}
                </div>

                {/* T-Shape & Individual Arms */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
                  <ToggleSwitch
                    label="T-Shape Mode"
                    description="Removes top arm for unobstructed headshot visibility"
                    checked={!!lines.tShape}
                    onChange={(checked) => updateLayer('lines', { tShape: checked })}
                  />

                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-4">
                      Visible Arms
                    </span>
                    <DirectionalArmsSelector
                      lines={lines}
                      disabledTop={lines.tShape}
                      onChange={(key, val) => updateLayer('lines', { [key]: val })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 2: CENTER DOT ===================== */}
        {activeTab === 'dot' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
              <ToggleSwitch
                label="Center Dot"
                description="Small focal point in the middle"
                checked={!!dot.enabled}
                onChange={(checked) => updateLayer('dot', { enabled: checked })}
              />

              {dot.enabled && (
                <>
                  <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] block">
                      Dot Shape
                    </span>
                    <SegmentedControl
                      value={dot.shape === 'square' ? 'square' : 'circle'}
                      onChange={(shape) => updateLayer('dot', { shape })}
                      options={[
                        { value: 'circle', label: 'Circle' },
                        { value: 'square', label: 'Pixel Square' },
                      ]}
                    />
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <ColorPickerRow
                      label="Dot Color"
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
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-5 pb-3 border-b border-[var(--border-subtle)]">
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

                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
                  <ToggleSwitch
                    label="Dot Outline"
                    description="Contrast ring around center dot"
                    checked={!!dot.outline}
                    onChange={(checked) => updateLayer('dot', { outline: checked })}
                  />

                  {dot.outline && (
                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                      <SliderControl
                        label="Outline Thickness"
                        min={1}
                        max={3}
                        value={dot.outlineWidth || 1}
                        onChange={(v) => updateLayer('dot', { outlineWidth: v })}
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
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
              <ToggleSwitch
                label="Center Ring"
                description="Perimeter ring for hipfire tracking"
                checked={!!ring.enabled}
                onChange={(checked) => updateLayer('ring', { enabled: checked })}
              />

              {ring.enabled && (
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <ColorPickerRow
                    label="Ring Color"
                    color={ring.color || '#00FF66'}
                    onChange={(c) => updateLayer('ring', { color: c })}
                    presets={colorPresets}
                  />
                </div>
              )}
            </div>

            {ring.enabled && (
              <>
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-5 pb-3 border-b border-[var(--border-subtle)]">
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
                    label="Ring Thickness"
                    min={1}
                    max={8}
                    value={ring.thickness || 2}
                    onChange={(v) => updateLayer('ring', { thickness: v })}
                  />
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
                  <ToggleSwitch
                    label="Dashed Style"
                    description="Segmented tactical ring"
                    checked={!!ring.dashed}
                    onChange={(checked) => updateLayer('ring', { dashed: checked })}
                  />

                  <ToggleSwitch
                    label="Inner Fill Tint"
                    description="Semi-transparent center tint"
                    checked={!!ring.fill}
                    onChange={(checked) => updateLayer('ring', { fill: checked })}
                  />

                  {ring.fill && (
                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                      <SliderControl
                        label="Tint Opacity"
                        min={5}
                        max={100}
                        unit="%"
                        value={Math.round((ring.fillOpacity || 0.2) * 100)}
                        onChange={(v) => updateLayer('ring', { fillOpacity: v / 100 })}
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
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
              <ToggleSwitch
                label="Optic Chevron"
                description="Angled arrow reticle"
                checked={!!chevron.enabled}
                onChange={(checked) => updateLayer('chevron', { enabled: checked })}
              />

              {chevron.enabled && (
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <ToggleSwitch
                    label="Invert (V-Shape)"
                    description="Flip chevron downwards"
                    checked={!!chevron.inverted}
                    onChange={(checked) => updateLayer('chevron', { inverted: checked })}
                  />
                </div>
              )}
            </div>

            {chevron.enabled && (
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
                <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-5 pb-3 border-b border-[var(--border-subtle)]">
                  Chevron Dimensions
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
                  label="Vertical Shift"
                  min={-20}
                  max={20}
                  value={chevron.offsetY || 0}
                  onChange={(v) => updateLayer('chevron', { offsetY: v })}
                />
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: TRANSFORM ===================== */}
        {activeTab === 'transform' && (
          <div className="space-y-6">
            {/* Scale & Angle */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
              <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-5 pb-3 border-b border-[var(--border-subtle)]">
                Scale & Angle
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
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
              <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                Dynamic Recoil
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
              <span className="text-xs text-[var(--text-secondary)] block leading-relaxed">
                Reticle arms expand outward when firing weapons.
              </span>
            </div>

            {/* Centering Position */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  Screen Calibration
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

              <div className="grid grid-cols-2 gap-4">
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

            {/* Drop Shadow */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
              <ToggleSwitch
                label="Drop Shadow"
                description="Dark shadow behind reticle for contrast"
                checked={!!shadow.enabled}
                onChange={(checked) => updateRoot('shadow', { ...shadow, enabled: checked })}
              />

              {shadow.enabled && (
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <SliderControl
                    label="Shadow Blur"
                    min={1}
                    max={10}
                    value={shadow.blur || 2}
                    onChange={(v) => updateRoot('shadow', { ...shadow, blur: v })}
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
