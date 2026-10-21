import React from 'react';

/**
 * Precision Slider with generous spacing, accent track, interactive stepper, and clear labels.
 */
export function SliderControl({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  onChange,
  disabled = false,
}) {
  const numValue = Number(value) || 0;
  const pct = Math.min(100, Math.max(0, ((numValue - min) / (max - min)) * 100));

  return (
    <div className={`space-y-3 mb-6 last:mb-0 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-main)] font-semibold text-xs tracking-wide select-none">
          {label}
        </span>
        <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-xl px-3 py-1 focus-within:border-[var(--accent)] transition-all shadow-sm">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={numValue}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-12 text-right bg-transparent text-[var(--text-main)] font-mono text-xs font-bold outline-none"
          />
          {unit && (
            <span className="text-[11px] text-[var(--text-muted)] ml-1 select-none font-mono font-medium">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center h-7">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numValue}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-medium) ${pct}%, var(--border-medium) 100%)`,
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none transition-all"
        />
      </div>
    </div>
  );
}

/**
 * Modern Card-style Toggle Switch with smooth knob, clear labels, and comfortable padding
 */
export function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] cursor-pointer select-none group transition-all shadow-sm ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      <div className="min-w-0 pr-4">
        {label && (
          <span className="text-xs font-bold text-[var(--text-main)] block truncate group-hover:text-[var(--accent)] transition-colors">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[11px] text-[var(--text-secondary)] block mt-1 leading-relaxed">
            {description}
          </span>
        )}
      </div>

      <div
        className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--border-medium)]'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}

/**
 * Crisp Segmented Button Group with Comfortable Hit Targets
 */
export function SegmentedControl({ options, value, onChange, size = 'sm' }) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] w-full">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold transition-all cursor-pointer ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            } ${
              isSelected
                ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-sm border border-[var(--border-medium)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Spacious Color Picker Row with Quick Swatches
 */
export function ColorPickerRow({ label, color, onChange, presets = [] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
        <span>{label || 'Color'}</span>
        <span className="font-mono text-[var(--accent)] uppercase text-xs font-bold bg-[var(--bg-input)] px-2.5 py-0.5 rounded-lg border border-[var(--border-subtle)]">
          {color}
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Custom Native Color Picker Swatch */}
        <label
          className="relative flex items-center justify-center w-8 h-8 rounded-xl border-2 border-dashed border-[var(--border-strong)] hover:border-[var(--accent)] cursor-pointer overflow-hidden shadow-inner shrink-0 group hover:scale-105 transition-all"
          title="Pick Custom Color"
        >
          <input
            type="color"
            value={color || '#00FF66'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div
            className="w-full h-full rounded-lg"
            style={{ backgroundColor: color || '#00FF66' }}
          />
        </label>

        {/* Preset Swatches */}
        {presets && presets.map((preset) => {
          const isSelected = (color || '').toLowerCase() === preset.toLowerCase();
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`w-8 h-8 rounded-xl border-2 shrink-0 transition-transform cursor-pointer shadow-sm ${
                isSelected
                  ? 'scale-115 border-white shadow-[0_0_12px_rgba(255,255,255,0.7)] ring-2 ring-[var(--accent)]'
                  : 'border-white/10 hover:scale-110 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Visual Directional Reticle Arms Selector
 */
export function DirectionalArmsSelector({ lines, onChange, disabledTop = false }) {
  const arms = [
    { key: 'top', label: 'Top', disabled: disabledTop },
    { key: 'left', label: 'Left', disabled: false },
    { key: 'right', label: 'Right', disabled: false },
    { key: 'bottom', label: 'Bottom', disabled: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {arms.map(({ key, label, disabled }) => {
        const isActive = lines[key] !== false && (!disabled || key !== 'top');
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key, !isActive)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              disabled
                ? 'opacity-30 border-[var(--border-subtle)] bg-[var(--bg-input)] cursor-not-allowed'
                : isActive
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-main)] font-bold shadow-sm'
                : 'bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <span>{label} Arm</span>
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                isActive ? 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]' : 'bg-neutral-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
