import React, { useState } from 'react';
import {
  Gamepad2,
  Plus,
  Trash2,
  CheckCircle2,
  Crosshair,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { generateCrosshairSVG } from '../utils/svgGenerator';

export function GameProfiles({
  profiles,
  onSaveProfiles,
  savedCrosshairs,
  activeProfile,
  onShowToast,
}) {
  const [newExe, setNewExe] = useState('');
  const [newGame, setNewGame] = useState('');
  const [newCrosshairId, setNewCrosshairId] = useState(DEFAULT_PRESETS[0].id);

  const allPresets = [...savedCrosshairs, ...DEFAULT_PRESETS];

  const handleAdd = () => {
    if (!newExe.trim() || !newGame.trim()) return;

    let cleanExe = newExe.trim();
    if (!cleanExe.toLowerCase().endsWith('.exe')) {
      cleanExe += '.exe';
    }

    const updated = [
      ...profiles,
      {
        processName: cleanExe,
        gameName: newGame.trim(),
        crosshairId: newCrosshairId,
      },
    ];

    onSaveProfiles(updated);
    if (onShowToast) onShowToast({ message: `Added auto-switch mapping for "${newGame.trim()}"`, type: 'success' });
    setNewExe('');
    setNewGame('');
  };

  const handleDelete = (index) => {
    const deletedName = profiles[index]?.gameName;
    const updated = profiles.filter((_, i) => i !== index);
    onSaveProfiles(updated);
    if (onShowToast) onShowToast({ message: `Removed mapping for "${deletedName}"`, type: 'info' });
  };

  const handleCrosshairChange = (index, crosshairId) => {
    const updated = [...profiles];
    updated[index].crosshairId = crosshairId;
    onSaveProfiles(updated);
    if (onShowToast) onShowToast({ message: `Updated crosshair for "${updated[index].gameName}"`, type: 'success' });
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
    <div className="flex flex-col h-full bg-[var(--bg-base)] p-5 select-none text-xs space-y-4 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
            <Gamepad2 size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-[var(--text-main)]">Auto-Game Profiles</h2>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Automatically switches your crosshair when associated games launch or take window focus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--accent)] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>Auto-Switching Engine Active</span>
        </div>
      </div>

      {/* Add Mapping Form */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shrink-0">
        <span className="font-semibold text-xs text-[var(--text-main)] block">Create Game Association:</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
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
              <option key={p.id} value={p.id} className="bg-[var(--bg-surface-elevated)] text-[var(--text-main)]">
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newExe.trim() || !newGame.trim()}
            className="btn-primary text-xs disabled:opacity-40"
          >
            <Plus size={13} />
            <span>Add Association</span>
          </button>
        </div>

        {/* Quick autofill suggestions */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px] text-[var(--text-tertiary)]">
          <span>Quick fill:</span>
          {commonGames.map((g) => (
            <button
              key={g.exe}
              onClick={() => {
                setNewGame(g.name);
                setNewExe(g.exe);
              }}
              className="px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors whitespace-nowrap"
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Profile List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {profiles.length === 0 ? (
          <div className="h-48 rounded-xl border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-[var(--text-tertiary)] gap-2">
            <Gamepad2 size={24} className="opacity-40" />
            <p>No game associations created yet. Add one above to enable auto-switching.</p>
          </div>
        ) : (
          profiles.map((p, idx) => {
            const isCurrentlyActive = activeProfile?.processName?.toLowerCase() === p.processName?.toLowerCase();
            const matchedCrosshair = allPresets.find((x) => x.id === p.crosshairId) || allPresets[0];
            const thumbSvg = matchedCrosshair ? generateCrosshairSVG(matchedCrosshair, { viewBoxSize: 56 }) : '';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isCurrentlyActive
                    ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Miniature Crosshair SVG Preview */}
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <div dangerouslySetInnerHTML={{ __html: thumbSvg }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[var(--text-main)]">{p.gameName}</span>
                      {isCurrentlyActive && (
                        <span className="px-2 py-0.2 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                          In Focus
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-tertiary)]">{p.processName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Linked Crosshair Switcher */}
                  <select
                    value={p.crosshairId}
                    onChange={(e) => handleCrosshairChange(idx, e.target.value)}
                    className="input-text text-xs py-1 cursor-pointer w-44"
                  >
                    {allPresets.map((x) => (
                      <option key={x.id} value={x.id} className="bg-[var(--bg-surface-elevated)] text-[var(--text-main)]">
                        {x.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 text-[var(--text-tertiary)] hover:text-rose-400 transition-colors"
                    title="Remove game mapping"
                  >
                    <Trash2 size={14} />
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
