import React from 'react';
import {
  Minus,
  Square,
  X,
  Eye,
  EyeOff,
  Monitor,
  Undo2,
  Redo2,
  Crosshair,
  ShieldCheck,
  CircleDot,
  Heart
} from 'lucide-react';

export function Header({
  overlayEnabled,
  onToggleOverlay,
  displays,
  selectedDisplayId,
  onSelectDisplay,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  hasUnsavedChanges,
  onSaveCurrent,
  activeProfileName,
  onOpenDonation,
}) {
  const isElectron = typeof window !== 'undefined' && !!window.api;

  return (
    <header
      className="h-12 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between px-3.5 select-none shrink-0 z-30"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Left: Brand & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
            <Crosshair size={14} className="stroke-[2.5]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-[var(--text-main)]">
              OpenCrosshair
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              v1.1.1
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-[var(--border-subtle)] mx-1" />

        {/* Status Indicators */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
            <span>Local Offline</span>
          </div>

          {activeProfileName && (
            <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>{activeProfileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Overlay Switch & Monitor Selector */}
      <div className="flex items-center gap-2.5" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Undo / Redo Buttons */}
        <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition-all ${
              canUndo
                ? 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                : 'text-[var(--text-disabled)] opacity-40 cursor-not-allowed'
            }`}
            title="Undo change (Ctrl+Z)"
          >
            <Undo2 size={13} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition-all ${
              canRedo
                ? 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                : 'text-[var(--text-disabled)] opacity-40 cursor-not-allowed'
            }`}
            title="Redo change (Ctrl+Y)"
          >
            <Redo2 size={13} />
          </button>
        </div>

        {/* Overlay Toggle Switch Pill */}
        <button
          onClick={onToggleOverlay}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            overlayEnabled
              ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-main)] shadow-[0_0_12px_var(--accent-glow)]'
              : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]'
          }`}
          title="Toggle Screen Overlay (Ctrl+Shift+X)"
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              overlayEnabled ? 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]' : 'bg-neutral-500'
            }`}
          />
          <span className="tracking-tight">
            Overlay: <span className="font-semibold">{overlayEnabled ? 'Active' : 'Muted'}</span>
          </span>
          {overlayEnabled ? (
            <Eye size={13} className="text-[var(--accent)] stroke-[2.2]" />
          ) : (
            <EyeOff size={13} />
          )}
        </button>

        {/* Multi-Monitor Dropdown */}
        {displays && displays.length > 1 && (
          <div className="flex items-center gap-1.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-xs">
            <Monitor size={12} className="text-[var(--text-secondary)]" />
            <select
              value={selectedDisplayId || ''}
              onChange={(e) => onSelectDisplay(Number(e.target.value))}
              className="bg-transparent text-[var(--text-main)] text-xs outline-none cursor-pointer pr-1"
            >
              {displays.map((d) => (
                <option key={d.id} value={d.id} className="bg-[var(--bg-surface-elevated)] text-[var(--text-main)]">
                  {d.label} {d.isPrimary ? '(Primary)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Donate Button Pill */}
        <button
          onClick={onOpenDonation}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 text-xs font-medium transition-all shadow-sm"
          title="Support & Donate to OpenCrosshair"
        >
          <Heart size={12} className="fill-rose-500/30 text-rose-400" />
          <span className="hidden sm:inline font-medium">Donate</span>
        </button>
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={() => isElectron && window.api.minimize()}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          title="Minimize to System Tray"
        >
          <Minus size={13} />
        </button>
        <button
          onClick={() => isElectron && window.api.maximize()}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          title="Maximize"
        >
          <Square size={11} />
        </button>
        <button
          onClick={() => isElectron && window.api.close()}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-rose-500 transition-colors"
          title="Minimize to System Tray / Close"
        >
          <X size={13} />
        </button>
      </div>
    </header>
  );
}
