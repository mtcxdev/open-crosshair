import React, { useState } from 'react';
import {
  Tv,
  Monitor,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export function OverlayHub({
  overlayEnabled,
  onToggleOverlay,
  displays,
  selectedDisplayId,
  onSelectDisplay,
  onShowToast,
}) {
  const [copied, setCopied] = useState(false);
  const streamerUrl = 'http://localhost:3175';

  const handleCopy = () => {
    navigator.clipboard.writeText(streamerUrl);
    setCopied(true);
    if (onShowToast) onShowToast({ message: 'OBS Browser Source URL copied to clipboard!', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)] p-5 select-none text-xs space-y-5 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
            <Tv size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-[var(--text-main)]">Overlay & Broadcast Hub</h2>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Manage your hardware monitor overlay and OBS Studio clean video feed integration.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleOverlay}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            overlayEnabled
              ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent)] shadow-sm'
              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
          }`}
        >
          {overlayEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
          <span>Overlay {overlayEnabled ? 'Active' : 'Muted'}</span>
        </button>
      </div>

      {/* Grid: 2 Columns (Left: Displays, Right: OBS Hub) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ================= Monitor Management ================= */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-[var(--accent)]" />
            <span className="font-semibold text-xs text-[var(--text-main)]">Display Target</span>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)]">
            Select the gaming monitor where your transparent click-through crosshair overlay will be rendered.
          </p>

          <div className="space-y-2">
            {displays && displays.length > 0 ? (
              displays.map((d) => {
                const isSelected = selectedDisplayId ? selectedDisplayId === d.id : d.isPrimary;
                return (
                  <div
                    key={d.id}
                    onClick={() => onSelectDisplay(d.id)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] shadow-sm'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-6 rounded border flex items-center justify-center text-[10px] font-mono ${isSelected ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'}`}>
                        {d.bounds ? `${d.bounds.width}p` : 'HD'}
                      </div>
                      <div>
                        <span className="font-medium text-xs text-[var(--text-main)] block">
                          {d.label || `Display ${d.id}`} {d.isPrimary && '(Primary)'}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                          {d.bounds ? `${d.bounds.width} × ${d.bounds.height} @ Scale ${d.scaleFactor || 1}x` : 'Hardware Output'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[11px] text-[var(--accent)] font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-3 rounded-lg border border-[var(--border-subtle)] text-[var(--text-tertiary)] text-center">
                Primary Desktop Display Active
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
            <span>Click-through rendering mode:</span>
            <span className="text-[var(--accent)] font-medium">Screen-Saver Z-Order</span>
          </div>
        </div>

        {/* ================= OBS Browser Source ================= */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv size={16} className="text-[var(--accent)]" />
              <span className="font-semibold text-xs text-[var(--text-main)]">OBS Studio & Streamlabs</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] font-mono text-[10px] font-semibold">
              Port 3175 Online
            </span>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)]">
            Capture your crosshair cleanly in OBS Studio without window capture lag, black screens, or anti-cheat conflicts.
          </p>

          <div className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={streamerUrl}
              className="bg-transparent flex-1 font-mono text-xs text-[var(--text-main)] outline-none"
            />
            <button
              onClick={handleCopy}
              className="btn-primary text-xs py-1 px-3"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          {/* Quick Guide */}
          <div className="space-y-2 pt-1 text-[11px] text-[var(--text-secondary)]">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-mono shrink-0 text-[var(--text-main)]">1</span>
              <span>In OBS Studio, add a <strong className="text-[var(--text-main)]">Browser Source</strong> and name it <code className="text-[var(--accent)] font-mono">Crosshair</code>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-mono shrink-0 text-[var(--text-main)]">2</span>
              <span>Paste URL <code className="text-[var(--accent)] font-mono">http://localhost:3175</code>, set Width to <strong className="text-[var(--text-main)]">1920</strong> and Height to <strong className="text-[var(--text-main)]">1080</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-mono shrink-0 text-[var(--text-main)]">3</span>
              <span>Your stream feed receives full subpixel vector clarity with zero lag and transparent background.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Performance Information Banner */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start gap-3">
        <ShieldCheck size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-xs text-[var(--text-main)] block">Anti-Cheat Safety Guarantee</span>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            OpenCrosshair does not inject code, hook DLLs, read or write game memory, or modify process handles. It functions purely as an OS-level transparent desktop window, making it completely compliant with Vanguard, VAC, Easy Anti-Cheat, BattlEye, and Ricochet.
          </p>
        </div>
      </div>
    </div>
  );
}
