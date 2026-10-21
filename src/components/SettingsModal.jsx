import React, { useState } from 'react';
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

  if (!isOpen) return null;

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
    { id: 'violet', label: 'Violet', color: '#8B5CF6' },
    { id: 'amber', label: 'Amber', color: '#F59E0B' },
    { id: 'rose', label: 'Rose', color: '#F43F5E' },
    { id: 'blue', label: 'Blue', color: '#3B82F6' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none text-xs">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-medium)] p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-main)]">Settings</h3>
              <p className="text-xs text-[var(--text-secondary)]">Preferences, interface scaling, and backups</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>

        {/* Section 1: Appearance & Theme */}
        <div className="p-4.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
            <Palette size={14} className="text-[var(--accent)]" />
            <span>Theme & Accent</span>
          </div>

          {/* Theme Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Laptop },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChangeTheme(id)}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold ${
                  theme === id
                    ? 'bg-[var(--bg-app)] border-[var(--accent)] text-[var(--accent)] shadow-sm'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Accent Color Swatches */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
            <span className="text-xs font-medium text-[var(--text-secondary)] block">Accent Color:</span>
            <div className="flex items-center gap-3">
              {accentOptions.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onChangeAccent(acc.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                    accent === acc.id ? 'scale-115 ring-2 ring-white/60 shadow-md' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: acc.color }}
                  title={acc.label}
                >
                  {accent === acc.id && <Check size={13} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: UI & Font Size Scaling */}
        <div className="p-4.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
              <Sliders size={14} className="text-[var(--accent)]" />
              <span>UI & Font Scale</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--bg-app)] px-2.5 py-0.5 rounded-lg border border-[var(--border-subtle)]">
                {uiScale}%
              </span>
              {uiScale !== 100 && (
                <button
                  type="button"
                  onClick={() => onChangeUiScale && onChangeUiScale(100)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] underline cursor-pointer"
                >
                  Reset (100%)
                </button>
              )}
            </div>
          </div>

          <div className="relative flex items-center h-6">
            <input
              type="range"
              min={75}
              max={130}
              step={1}
              value={uiScale}
              onChange={(e) => onChangeUiScale && onChangeUiScale(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((uiScale - 75) / (130 - 75)) * 100}%, var(--border-medium) ${((uiScale - 75) / (130 - 75)) * 100}%, var(--border-medium) 100%)`,
              }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none transition-all"
            />
          </div>

          <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-mono">
            <span>Compact (75%)</span>
            <span>Normal (100%)</span>
            <span>Large (130%)</span>
          </div>
        </div>

        {/* Section 3: Hotkeys */}
        <div className="p-4.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
            <Keyboard size={14} className="text-[var(--accent)]" />
            <span>Shortcuts</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)] font-medium">Toggle Screen Overlay</span>
              <kbd className="px-2.5 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-bold text-xs">
                Ctrl + Shift + X
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)] font-medium">Re-Center Crosshair (0, 0)</span>
              <kbd className="px-2.5 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-bold text-xs">
                Ctrl + Shift + C
              </kbd>
            </div>
          </div>
        </div>

        {/* Section 4: Export & Backup */}
        <div className="p-4.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
            <Download size={14} className="text-[var(--accent)]" />
            <span>Backup & Export</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadSVG}
              className="py-2.5 px-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] text-[var(--text-main)] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download size={14} />
              <span>Export SVG</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="py-2.5 px-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] text-[var(--text-main)] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download size={14} />
              <span>Backup (.json)</span>
            </button>
          </div>

          <label className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[var(--border-medium)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-main)] flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-medium">
            <Upload size={14} />
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
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-400 font-medium">Are you sure?</span>
              <button
                onClick={() => {
                  onResetDefaults();
                  setConfirmReset(false);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-[var(--text-muted)] hover:text-rose-400 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw size={13} />
              <span>Reset Factory Settings</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-bold text-xs cursor-pointer transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
