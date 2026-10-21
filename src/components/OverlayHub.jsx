import React, { useState } from 'react';
import {
  Monitor,
  Tv,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export function OverlayHub({
  overlayEnabled,
  onToggleOverlay,
  displays = [],
  selectedDisplayId,
  onSelectDisplay,
  streamerInfo = { port: 3175, url: 'http://localhost:3175', preferredPort: 3175 },
  onChangeStreamerPort,
  onShowToast,
}) {
  const [copied, setCopied] = useState(false);
  const [customPort, setCustomPort] = useState('');
  const [isChangingPort, setIsChangingPort] = useState(false);

  const streamerUrl = streamerInfo?.url || 'http://localhost:3175';
  const activePort = streamerInfo?.port || 3175;
  const preferredPort = streamerInfo?.preferredPort || 3175;
  const isFallback = activePort !== preferredPort;

  const handleCopy = () => {
    navigator.clipboard.writeText(streamerUrl);
    setCopied(true);
    if (onShowToast) onShowToast({ message: 'OBS Browser Source URL copied!', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyPort = async (e) => {
    e.preventDefault();
    const portNum = parseInt(customPort, 10);
    if (!portNum || portNum < 1024 || portNum > 65535) {
      if (onShowToast) onShowToast({ message: 'Enter a valid port between 1024 and 65535', type: 'error' });
      return;
    }
    setIsChangingPort(true);
    try {
      if (onChangeStreamerPort) {
        await onChangeStreamerPort(portNum);
        if (onShowToast) onShowToast({ message: `OBS Streamer port changed to ${portNum}`, type: 'success' });
        setCustomPort('');
      }
    } catch (err) {
      if (onShowToast) onShowToast({ message: 'Failed to bind port: ' + err.message, type: 'error' });
    } finally {
      setIsChangingPort(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] p-6 select-none overflow-y-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
            <Tv size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-[var(--text-main)]">Overlay & Broadcast Hub</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Manage your hardware monitor overlay and OBS Studio clean video feed integration.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleOverlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all shadow-sm ${
            overlayEnabled
              ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent)]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          {overlayEnabled ? <Eye size={15} /> : <EyeOff size={15} />}
          <span>Overlay {overlayEnabled ? 'Active' : 'Hidden'}</span>
        </button>
      </div>

      {/* Grid: 2 Columns (Left: Displays, Right: OBS Hub) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= Monitor Management ================= */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Monitor size={17} className="text-[var(--accent)]" />
            <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">Display Target</span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Select the gaming monitor where your transparent click-through crosshair overlay will be rendered.
          </p>

          <div className="space-y-3">
            {displays && displays.length > 0 ? (
              displays.map((d) => {
                const isSelected = selectedDisplayId ? selectedDisplayId === d.id : d.isPrimary;
                return (
                  <div
                    key={d.id}
                    onClick={() => onSelectDisplay(d.id)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-surface)] border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold ${isSelected ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-subtle)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-surface)]'}`}>
                        {d.bounds ? `${d.bounds.width}p` : 'HD'}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[var(--text-main)] block">
                          {d.label || `Display ${d.id}`} {d.isPrimary && '(Primary)'}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-secondary)] mt-0.5 block">
                          {d.bounds ? `${d.bounds.width} × ${d.bounds.height} @ Scale ${d.scaleFactor || 1}x` : 'Hardware Output'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-xs text-[var(--accent)] font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={15} /> Active
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-secondary)] text-center text-xs">
                Primary Desktop Display Active
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Click-through rendering mode:</span>
            <span className="text-[var(--accent)] font-bold">Screen-Saver Z-Order</span>
          </div>
        </div>

        {/* ================= OBS Browser Source ================= */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Tv size={17} className="text-[var(--accent)]" />
              <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">OBS Studio & Streamlabs</span>
            </div>
            <div className="flex items-center gap-2">
              {isFallback && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                  Auto-routed
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] font-mono text-xs font-bold">
                Port {activePort} Online
              </span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Capture your crosshair cleanly in OBS Studio without window capture lag, black screens, or anti-cheat conflicts.
          </p>

          <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center gap-3 shadow-inner">
            <input
              type="text"
              readOnly
              value={streamerUrl}
              className="bg-transparent flex-1 font-mono text-xs text-[var(--text-main)] outline-none font-bold"
            />
            <button
              onClick={handleCopy}
              className="btn-primary text-xs py-1.5 px-3.5"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          {/* Custom Port Configuration */}
          <form onSubmit={handleApplyPort} className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] shrink-0 font-medium">
              <Server size={14} className="text-[var(--text-muted)]" />
              <span>Change Port:</span>
            </div>
            <input
              type="number"
              min="1024"
              max="65535"
              placeholder={`Default: ${preferredPort}`}
              value={customPort}
              onChange={(e) => setCustomPort(e.target.value)}
              className="input-text w-32 py-1.5 text-xs font-mono"
            />
            <button
              type="submit"
              disabled={!customPort || isChangingPort}
              className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
            >
              {isChangingPort ? 'Binding...' : 'Set Port'}
            </button>
          </form>

          {/* Quick Guide */}
          <div className="space-y-2.5 pt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-mono font-bold shrink-0 text-[var(--accent)]">1</span>
              <span>In OBS Studio, add a <strong className="text-[var(--text-main)]">Browser Source</strong> and name it <code className="text-[var(--accent)] font-mono font-bold">Crosshair</code>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-mono font-bold shrink-0 text-[var(--accent)]">2</span>
              <span>Paste URL <code className="text-[var(--accent)] font-mono font-bold">{streamerUrl}</code>, set Width to <strong className="text-[var(--text-main)]">1920</strong> and Height to <strong className="text-[var(--text-main)]">1080</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-mono font-bold shrink-0 text-[var(--accent)]">3</span>
              <span>Your stream feed receives full subpixel vector clarity with zero lag and transparent background.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Performance Information Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-start gap-4 shadow-sm">
        <ShieldCheck size={22} className="text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider block">Anti-Cheat Safety Guarantee</span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            OpenCrosshair does not inject code, hook DLLs, read or write game memory, or modify process handles. It functions purely as an OS-level transparent desktop window, making it completely compliant with Vanguard, VAC, Easy Anti-Cheat, BattlEye, and Ricochet.
          </p>
        </div>
      </div>
    </div>
  );
}
