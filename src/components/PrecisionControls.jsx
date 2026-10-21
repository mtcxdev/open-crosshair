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
    <div className={`space-y-2 mb-4.5 last:mb-0 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-main)] font-semibold select-none tracking-wide">
          {label}
        </span>
        <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-2.5 py-1 focus-within:border-[var(--accent)] transition-all shadow-sm">
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
            <span className="text-[11px] text-[var(--text-muted)] ml-1 select-none font-mono">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center h-6">
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
 * Modern Card-style Toggle Switch with smooth knob and clear labels
 */
export function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] cursor-pointer select-none group transition-all ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      <div className="min-w-0 pr-3">
        {label && (
          <span className="text-xs font-bold text-[var(--text-main)] block truncate group-hover:text-[var(--accent)] transition-colors">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[11px] text-[var(--text-secondary)] block mt-0.5 leading-relaxed">
            {description}
          </span>
        )}
      </div>

      <div
        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
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
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] w-full">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
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
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-main)]">
        <span>{label || 'Color'}</span>
        <span className="font-mono text-[var(--accent)] uppercase text-xs font-bold bg-[var(--bg-input)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
          {color}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border-medium)] cursor-pointer overflow-hidden shadow-inner shrink-0 group hover:scale-105 transition-transform">
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

        <div className="flex-1 flex items-center bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 focus-within:border-[var(--accent)] transition-all shadow-sm">
          <span className="text-[var(--text-muted)] font-mono text-xs mr-1">#</span>
          <input
            type="text"
            value={(color || '').replace(/^#/, '')}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
              onChange(`#${val}`);
            }}
            className="w-full bg-transparent text-[var(--text-main)] font-mono text-xs font-semibold uppercase outline-none"
            placeholder="00FF66"
          />
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {presets.map((preset) => {
            const isSelected = (color || '').toLowerCase() === preset.toLowerCase();
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                className={`w-7 h-7 rounded-lg border-2 shrink-0 transition-transform cursor-pointer shadow-sm ${
                  isSelected
                    ? 'scale-115 border-white shadow-[0_0_10px_rgba(255,255,255,0.6)] ring-2 ring-[var(--accent)]'
                    : 'border-white/10 hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Visual Directional Reticle Arms Selector (Replaces Clunky Candy Buttons)
 */
export function DirectionalArmsSelector({ lines, onChange, disabledTop = false }) {
  const arms = [
    { key: 'top', label: 'Top', disabled: disabledTop },
    { key: 'left', label: 'Left', disabled: false },
    { key: 'right', label: 'Right', disabled: false },
    { key: 'bottom', label: 'Bottom', disabled: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {arms.map(({ key, label, disabled }) => {
        const isActive = lines[key] !== false && (!disabled || key !== 'top');
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key, !isActive)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
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
