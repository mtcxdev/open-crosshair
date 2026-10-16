import React, { useState } from 'react';
import {
  Settings,
  Keyboard,
  Palette,
  Shield,
  Download,
  Upload,
  RefreshCw,
  X,
  Sun,
  Moon,
  Laptop,
  Check
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
  allData,
  onImportBackup,
  onShowToast,
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
    { id: 'lime', label: 'Lime', color: '#84CC16' },
    { id: 'blue', label: 'Blue', color: '#3B82F6' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none text-xs">
      <div className="w-full max-w-xl card-elevated p-5 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
              <Settings size={15} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[var(--text-main)]">Application Preferences</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Interface appearance, themes, and system settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ================= Theme Selection ================= */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
            <Palette size={14} className="text-[var(--accent)]" />
            <span>Appearance & Theme</span>
          </div>

          {/* Theme Mode Segmented Control */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChangeTheme('dark')}
              className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Moon size={14} />
              <span>Dark</span>
            </button>

            <button
              onClick={() => onChangeTheme('light')}
              className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                theme === 'light'
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Sun size={14} />
              <span>Light</span>
            </button>

            <button
              onClick={() => onChangeTheme('system')}
              className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                theme === 'system'
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Laptop size={14} />
              <span>System</span>
            </button>
          </div>

          {/* Accent Color Swatches */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-secondary)] block">Accent Color:</span>
            <div className="flex items-center gap-2">
              {accentOptions.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onChangeAccent(acc.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    accent === acc.id ? 'scale-110 shadow-md ring-2 ring-white/50' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: acc.color }}
                  title={acc.label}
                >
                  {accent === acc.id && <Check size={14} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= Hotkeys ================= */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
            <Keyboard size={14} className="text-[var(--accent)]" />
            <span>Global Hotkeys</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Toggle Overlay Visibility</span>
              <kbd className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-semibold">
                Ctrl + Shift + X
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Re-Center Crosshair to Pixel (0, 0)</span>
              <kbd className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-semibold">
                Ctrl + Shift + C
              </kbd>
            </div>
          </div>
        </div>

        {/* ================= Backup & SVG Export ================= */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
            <Download size={14} className="text-[var(--accent)]" />
            <span>Export & Library Backup</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadSVG}
              className="btn-secondary text-xs py-2"
            >
              <Download size={13} />
              <span>Download Vector SVG</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="btn-secondary text-xs py-2"
            >
              <Download size={13} />
              <span>Export JSON Backup</span>
            </button>
          </div>

          <label className="btn-ghost w-full border border-dashed border-[var(--border-medium)] py-2 text-xs cursor-pointer flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)]">
            <Upload size={13} />
            <span>Restore Library from JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-400">Are you sure?</span>
              <button
                onClick={() => {
                  onResetDefaults();
                  setConfirmReset(false);
                }}
                className="px-2 py-1 rounded bg-rose-600 text-white font-medium text-[11px]"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] text-[11px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-rose-400 hover:underline text-[11px] flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Reset Factory Settings</span>
            </button>
          )}

          <button onClick={onClose} className="btn-primary text-xs px-4">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
