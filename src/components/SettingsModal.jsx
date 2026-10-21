import React, { useState, useEffect } from 'react';
import {
  Settings,
  Keyboard,
  Palette,
  Download,
  Upload,
  RefreshCw,
  X,
  Sun,
  Moon,
  Laptop,
  Check,
  Heart,
  Sliders,
} from 'lucide-react';
import { generateCrosshairSVG } from '../utils/svgGenerator';

export function SettingsModal({
  isOpen,
  onClose,
  currentConfig,
  onResetDefaults,
  theme,
  onChangeTheme,
  accent,
  onChangeAccent,
  uiScale = 100,
  onChangeUiScale,
  allData,
  onImportBackup,
  onShowToast,
  onOpenDonation,
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleDownloadSVG = () => {
    const svgStr = generateCrosshairSVG(currentConfig, { viewBoxSize: 128 });
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentConfig.name || 'crosshair').replace(/\s+/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast({ message: 'SVG vector crosshair downloaded!', type: 'success' });
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opencrosshair_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast({ message: 'Full library backup exported!', type: 'success' });
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (onImportBackup) {
          onImportBackup(parsed);
          if (onShowToast) onShowToast({ message: 'Backup restored successfully!', type: 'success' });
        }
      } catch (err) {
        if (onShowToast) onShowToast({ message: 'Invalid JSON backup file!', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const accentOptions = [
    { id: 'emerald', label: 'Emerald', color: '#10B981' },
    { id: 'cyan', label: 'Cyan', color: '#06B6D4' },
    { id: 'lime', label: 'Lime', color: '#84CC16' },
    { id: 'violet', label: 'Violet', color: '#8B5CF6' },
    { id: 'magenta', label: 'Magenta', color: '#D946EF' },
    { id: 'rose', label: 'Rose', color: '#F43F5E' },
    { id: 'amber', label: 'Amber', color: '#F59E0B' },
    { id: 'orange', label: 'Orange', color: '#F97316' },
    { id: 'blue', label: 'Blue', color: '#3B82F6' },
    { id: 'white', label: 'Silver White', color: '#E2E8F0' },
  ];

  const isCustomAccent = Boolean(accent && accent.startsWith('#'));
  const [customHex, setCustomHex] = useState(isCustomAccent ? accent.replace(/^#/, '') : '');

  useEffect(() => {
    if (isCustomAccent) {
      setCustomHex(accent.replace(/^#/, ''));
    } else {
      setCustomHex('');
    }
  }, [accent, isCustomAccent]);

  const handleHexChange = (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
    setCustomHex(raw);
    if (raw.length === 6) {
      onChangeAccent(`#${raw}`);
    }
  };

  const handleHexBlur = () => {
    if (customHex.length === 3) {
      const expanded = customHex.split('').map((c) => c + c).join('');
      setCustomHex(expanded);
      onChangeAccent(`#${expanded}`);
    } else if (customHex.length > 0 && customHex.length < 6 && isCustomAccent) {
      setCustomHex(accent.replace(/^#/, ''));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none text-xs">
      <div className="w-full max-w-xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-medium)] p-7 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3.5">
            <img
              src="/icon.png"
              alt="OpenCrosshair Logo"
              className="w-10 h-10 rounded-2xl object-contain shadow-md drop-shadow select-none pointer-events-none"
            />
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)]">Settings</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Preferences, interface scaling, and backups</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Appearance & Theme */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
            <Palette size={15} className="text-[var(--accent)]" />
            <span>Theme & Accent</span>
          </div>

          {/* Theme Selector */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'system', label: 'System Theme', icon: Laptop },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChangeTheme(id)}
                className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs ${
                  theme === id
                    ? 'bg-[var(--bg-app)] border-[var(--accent)] text-[var(--accent)] shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Accent Color Swatches & Custom Picker */}
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-secondary)]">Accent Color:</span>
                {isCustomAccent && (
                  <span className="text-[11px] font-mono font-bold text-[var(--accent)] bg-[var(--bg-input)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                    {accent.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Custom Picker Controls */}
              <div className="flex items-center gap-2">
                <label
                  title="Pick custom color"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all shadow-sm border border-[var(--border-medium)] relative overflow-hidden ${
                    isCustomAccent
                      ? 'ring-2 ring-white/90 shadow-md'
                      : 'hover:scale-105 opacity-85 hover:opacity-100 bg-[var(--bg-input)]'
                  }`}
                  style={isCustomAccent ? { backgroundColor: accent } : {}}
                >
                  <input
                    type="color"
                    value={isCustomAccent ? accent : '#10B981'}
                    onChange={(e) => onChangeAccent(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {isCustomAccent ? (
                    <Check size={12} className="text-white drop-shadow stroke-[3] pointer-events-none" />
                  ) : (
                    <Palette size={13} className="text-[var(--text-secondary)] pointer-events-none" />
                  )}
                </label>

                {/* Hex input */}
                <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 focus-within:border-[var(--accent)] transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] mr-0.5">#</span>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="HEX..."
                    value={customHex}
                    onChange={handleHexChange}
                    onBlur={handleHexBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleHexBlur()}
                    className="w-14 bg-transparent font-mono text-[11px] text-[var(--text-main)] outline-none uppercase placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-10 gap-2 pt-1">
              {accentOptions.map((acc) => {
                const isSelected = accent === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => onChangeAccent(acc.id)}
                    className={`h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm relative ${
                      isSelected
                        ? 'scale-110 ring-2 ring-white/90 shadow-md'
                        : 'hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: acc.color }}
                    title={acc.label}
                  >
                    {isSelected && <Check size={14} className="text-white drop-shadow stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: UI & Font Size Scaling */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
              <Sliders size={15} className="text-[var(--accent)]" />
              <span>UI & Font Scale</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--bg-input)] px-3 py-1 rounded-xl border border-[var(--border-subtle)]">
                {uiScale}%
              </span>
              {uiScale !== 100 && (
                <button
                  type="button"
                  onClick={() => onChangeUiScale && onChangeUiScale(100)}
                  className="text-xs text-[var(--accent)] hover:underline font-bold cursor-pointer"
                >
                  Reset (100%)
                </button>
              )}
            </div>
          </div>

          <div className="relative flex items-center h-7">
            <input
              type="range"
              min={85}
              max={125}
              step={1}
              value={uiScale}
              onChange={(e) => onChangeUiScale && onChangeUiScale(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((uiScale - 85) / (125 - 85)) * 100}%, var(--border-medium) ${((uiScale - 85) / (125 - 85)) * 100}%, var(--border-medium) 100%)`,
              }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none transition-all"
            />
          </div>

          <div className="flex justify-between text-xs text-[var(--text-muted)] font-mono font-medium">
            <span>Compact (85%)</span>
            <span>Default (100%)</span>
            <span>Large (125%)</span>
          </div>
        </div>

        {/* Section 3: Hotkeys */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
            <Keyboard size={15} className="text-[var(--accent)]" />
            <span>Shortcuts</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-main)] font-medium">Toggle Screen Overlay</span>
              <kbd className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-bold text-xs shadow-sm">
                Ctrl + Shift + X
              </kbd>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-main)] font-medium">Re-Center Crosshair (0, 0)</span>
              <kbd className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-bold text-xs shadow-sm">
                Ctrl + Shift + C
              </kbd>
            </div>
          </div>
        </div>

        {/* Section 4: Export & Backup */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
            <Download size={15} className="text-[var(--accent)]" />
            <span>Backup & Export</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadSVG}
              className="py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <Download size={15} className="text-[var(--accent)]" />
              <span>Export SVG</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <Download size={15} className="text-[var(--accent)]" />
              <span>Backup (.json)</span>
            </button>
          </div>

          <label className="w-full py-3 px-4 rounded-xl border border-dashed border-[var(--border-medium)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-main)] flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-bold">
            <Upload size={15} className="text-[var(--accent)]" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          {confirmReset ? (
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-rose-400 font-bold">Are you sure?</span>
              <button
                onClick={() => {
                  onResetDefaults();
                  setConfirmReset(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-[var(--text-muted)] hover:text-rose-400 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw size={14} />
              <span>Reset Factory Settings</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-primary text-xs px-6 py-2.5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
