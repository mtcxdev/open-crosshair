import React, { useState, useEffect } from 'react';

/**
 * Precision Slider with filled accent track, interactive stepper, and unified unit badge.
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
    <div className={`space-y-1.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)] font-medium">{label}</span>
        <div className="flex items-center bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-md px-1.5 py-0.5 focus-within:border-[var(--accent)] transition-colors">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={numValue}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-10 text-right bg-transparent text-[var(--text-main)] font-mono text-[11px] outline-none"
          />
          {unit && (
            <span className="text-[10px] text-[var(--text-tertiary)] ml-1 select-none font-mono">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center h-5">
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
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none transition-all"
        />
      </div>
    </div>
  );
}

/**
 * Modern iOS / Linear style Toggle Switch
 */
export function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between py-1.5 cursor-pointer select-none group ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      <div className="min-w-0 pr-3">
        {label && (
          <span className="text-xs font-medium text-[var(--text-main)] block truncate group-hover:text-[var(--accent)] transition-colors">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[11px] text-[var(--text-tertiary)] block leading-tight">
            {description}
          </span>
        )}
      </div>

      <div
        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--bg-surface-active)] border border-[var(--border-medium)]'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}

/**
 * Crisp Segmented Button Group
 */
export function SegmentedControl({ options, value, onChange, size = 'sm' }) {
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] w-full">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-medium transition-all ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            } ${
              isSelected
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-semibold shadow-sm border border-[var(--border-subtle)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
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
 * Polished Color Picker Row with Quick Swatches
 */
export function ColorPickerRow({ label, color, onChange, presets = [] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
        <span>{label || 'COLOR'}</span>
        <span className="font-mono text-[var(--text-main)] uppercase text-[11px]">
          {color}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-medium)] cursor-pointer overflow-hidden shadow-inner shrink-0 group">
          <input
            type="color"
            value={color || '#00FF66'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div
            className="w-full h-full rounded-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: color || '#00FF66' }}
          />
        </label>

        <div className="flex-1 flex items-center bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 focus-within:border-[var(--accent)] transition-colors">
          <span className="text-[var(--text-tertiary)] font-mono text-xs mr-1">#</span>
          <input
            type="text"
            value={(color || '').replace(/^#/, '')}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
              onChange(`#${val}`);
            }}
            className="w-full bg-transparent text-[var(--text-main)] font-mono text-xs uppercase outline-none"
            placeholder="00FF66"
          />
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-0.5">
          {presets.map((preset) => {
            const isSelected = (color || '').toLowerCase() === preset.toLowerCase();
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                className={`w-6 h-6 rounded-md border shrink-0 transition-transform ${
                  isSelected
                    ? 'scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.4)] ring-2 ring-[var(--accent)]'
                    : 'border-white/10 hover:scale-105 opacity-80 hover:opacity-100'
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
