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
  Check,
  Heart
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
    { id: 'lime', label: 'Lime', color: '#84CC16' },
    { id: 'blue', label: 'Blue', color: '#3B82F6' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none text-xs">
      <div className="w-full max-w-lg card-elevated p-6 space-y-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
              <Settings size={17} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-main)]">Settings</h3>
              <p className="text-xs text-[var(--text-secondary)]">Customize theme, UI scale, and shortcuts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>

        {/* ================= Theme Selection ================= */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
            <Palette size={15} className="text-[var(--accent)]" />
            <span>Look & Theme</span>
          </div>

          {/* Theme Mode Segmented Control */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onChangeTheme('dark')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Moon size={15} />
              <span>Dark</span>
            </button>

            <button
              onClick={() => onChangeTheme('light')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Sun size={15} />
              <span>Light</span>
            </button>

            <button
              onClick={() => onChangeTheme('system')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Laptop size={15} />
              <span>System</span>
            </button>
          </div>

          {/* Accent Color Swatches */}
          <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
            <span className="text-xs font-medium text-[var(--text-secondary)] block">Accent Color:</span>
            <div className="flex items-center gap-2.5 flex-wrap">
              {accentOptions.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onChangeAccent(acc.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                    accent === acc.id ? 'scale-115 shadow-md ring-2 ring-white/60' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: acc.color }}
                  title={acc.label}
                >
                  {accent === acc.id && <Check size={14} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Interface & Font Scaling Slider */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-main)]">UI & Font Size:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--bg-base)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                  {uiScale}%
                </span>
                {uiScale !== 100 && (
                  <button
                    type="button"
                    onClick={() => onChangeUiScale && onChangeUiScale(100)}
                    className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent)] underline cursor-pointer"
                  >
                    Reset
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

            <div className="flex justify-between text-[11px] text-[var(--text-tertiary)] font-mono">
              <span>Compact (75%)</span>
              <span>Default (100%)</span>
              <span>Large (130%)</span>
            </div>
          </div>
        </div>

        {/* ================= Hotkeys ================= */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
            <Keyboard size={15} className="text-[var(--accent)]" />
            <span>Shortcuts & Hotkeys</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)] font-medium">Show / Hide Crosshair</span>
              <kbd className="px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-bold text-xs">
                Ctrl + Shift + X
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)] font-medium">Reset Position to (0, 0)</span>
              <kbd className="px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-medium)] font-mono text-[var(--accent)] font-bold text-xs">
                Ctrl + Shift + C
              </kbd>
            </div>
          </div>
        </div>

        {/* ================= Support & Donate ================= */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
              <Heart size={15} className="text-rose-400 fill-rose-500/20" />
              <span>Support Development</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
              Free & Open Source
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            OpenCrosshair has zero subscriptions, zero ads, and zero telemetry. If you enjoy using it, consider donating to help keep new presets and builds thriving!
          </p>

          <button
            onClick={() => {
              onClose();
              if (onOpenDonation) onOpenDonation();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 text-rose-400 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-xs"
          >
            <Heart size={14} className="fill-rose-500/30" />
            <span>Support Developer (Crypto / Donation)</span>
          </button>
        </div>

        {/* ================= Backup & SVG Export ================= */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
            <Download size={15} className="text-[var(--accent)]" />
            <span>Export & Backup</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadSVG}
              className="btn-secondary text-xs py-2.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Save as SVG Vector</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="btn-secondary text-xs py-2.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export Backup (.json)</span>
            </button>
          </div>

          <label className="btn-ghost w-full border border-dashed border-[var(--border-medium)] py-2.5 text-xs cursor-pointer flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] rounded-xl">
            <Upload size={14} />
            <span>Restore from Backup File</span>
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
