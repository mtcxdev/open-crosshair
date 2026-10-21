import React, { useState } from 'react';
import {
  Gamepad2,
  Plus,
  Trash2,
  Check,
  Search,
  ExternalLink,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { generateCrosshairSVG } from '../utils/svgGenerator';

export function GameProfiles({
  profiles = [],
  onSaveProfiles,
  savedCrosshairs = [],
  activeProfile,
  onShowToast,
}) {
  const [newExe, setNewExe] = useState('');
  const [newGame, setNewGame] = useState('');
  const [newCrosshairId, setNewCrosshairId] = useState(DEFAULT_PRESETS[0].id);

  const allPresets = [...savedCrosshairs, ...DEFAULT_PRESETS];

  const handleAdd = () => {
    if (!newExe.trim() || !newGame.trim()) return;

    // Normalize exe name
    let cleanExe = newExe.trim();
    if (!cleanExe.toLowerCase().endsWith('.exe')) {
      cleanExe += '.exe';
    }

    // Check if already mapped
    if (profiles.some((p) => p.processName?.toLowerCase() === cleanExe.toLowerCase())) {
      if (onShowToast) onShowToast({ message: `"${cleanExe}" is already mapped!`, type: 'error' });
      return;
    }

    const updated = [
      ...profiles,
      {
        gameName: newGame.trim(),
        processName: cleanExe,
        crosshairId: newCrosshairId,
      },
    ];

    onSaveProfiles(updated);
    setNewExe('');
    setNewGame('');
    if (onShowToast) onShowToast({ message: `Added profile for "${newGame}"`, type: 'success' });
  };

  const handleDelete = (index) => {
    const updated = profiles.filter((_, i) => i !== index);
    onSaveProfiles(updated);
    if (onShowToast) onShowToast({ message: 'Profile removed', type: 'info' });
  };

  const handleCrosshairChange = (index, crosshairId) => {
    const updated = [...profiles];
    updated[index].crosshairId = crosshairId;
    onSaveProfiles(updated);
  };

  // Popular games quick add recommendations
  const commonGames = [
    { name: 'Counter-Strike 2', exe: 'cs2.exe' },
    { name: 'Valorant', exe: 'VALORANT-Win64-Shipping.exe' },
    { name: 'Apex Legends', exe: 'r5apex.exe' },
    { name: 'Rust', exe: 'RustClient.exe' },
    { name: 'Overwatch 2', exe: 'Overwatch.exe' },
    { name: 'Rainbow Six Siege', exe: 'RainbowSix.exe' },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] p-6 select-none overflow-hidden space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
            <Gamepad2 size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-[var(--text-main)]">Auto-Game Profiles</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Automatically switches your crosshair when associated games launch or take window focus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--accent)] font-bold">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>Auto-Switch Active</span>
        </div>
      </div>

      {/* Add Mapping Form */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shrink-0 shadow-sm">
        <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider block">
          Create Game Association
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Process Exe (e.g. cs2.exe)"
            value={newExe}
            onChange={(e) => setNewExe(e.target.value)}
            className="input-text text-xs"
          />
          <input
            type="text"
            placeholder="Game Name (e.g. CS2)"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
            className="input-text text-xs"
          />
          <select
            value={newCrosshairId}
            onChange={(e) => setNewCrosshairId(e.target.value)}
            className="input-text text-xs cursor-pointer"
          >
            {allPresets.map((p) => (
              <option key={p.id} value={p.id} className="bg-[var(--bg-card)] text-[var(--text-main)]">
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newExe.trim() || !newGame.trim()}
            className="btn-primary text-xs disabled:opacity-40"
          >
            <Plus size={15} />
            <span>Add Association</span>
          </button>
        </div>

        {/* Quick autofill suggestions */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto text-xs text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-muted)]">Quick fill:</span>
          {commonGames.map((g) => (
            <button
              key={g.exe}
              onClick={() => {
                setNewGame(g.name);
                setNewExe(g.exe);
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all whitespace-nowrap cursor-pointer font-medium"
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Profile List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
        {profiles.length === 0 ? (
          <div className="h-48 rounded-2xl border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-[var(--text-secondary)] gap-3">
            <Gamepad2 size={28} className="opacity-40 text-[var(--accent)]" />
            <p className="text-xs font-medium">No game associations created yet. Add one above to enable auto-switching.</p>
          </div>
        ) : (
          profiles.map((p, idx) => {
            const isCurrentlyActive = activeProfile?.processName?.toLowerCase() === p.processName?.toLowerCase();
            const matchedCrosshair = allPresets.find((x) => x.id === p.crosshairId) || allPresets[0];
            const thumbSvg = matchedCrosshair ? generateCrosshairSVG(matchedCrosshair, { viewBoxSize: 56 }) : '';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all shadow-sm ${
                  isCurrentlyActive
                    ? 'bg-[var(--bg-card)] border-[var(--accent)] ring-2 ring-[var(--accent)]/30'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Miniature Crosshair SVG Preview */}
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 shadow-inner">
                    <div dangerouslySetInnerHTML={{ __html: thumbSvg }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--text-main)]">{p.gameName}</span>
                      {isCurrentlyActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-[11px] font-bold flex items-center gap-1.5 border border-[var(--accent-border)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                          In Focus
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-[var(--text-secondary)] mt-0.5 block">{p.processName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Linked Crosshair Switcher */}
                  <select
                    value={p.crosshairId}
                    onChange={(e) => handleCrosshairChange(idx, e.target.value)}
                    className="input-text text-xs py-2 cursor-pointer w-48"
                  >
                    {allPresets.map((x) => (
                      <option key={x.id} value={x.id} className="bg-[var(--bg-card)] text-[var(--text-main)]">
                        {x.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-rose-400 hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                    title="Remove game mapping"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
