import React, { useState } from 'react';
import {
  Bookmark,
  Copy,
  Check,
  Trash2,
  Upload,
  Plus,
  Search,
  Share2,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { generateCrosshairSVG } from '../utils/svgGenerator';
import { encodeSharecode, decodeSharecode } from '../utils/sharecode';

export function Presets({
  currentConfig,
  onSelectPreset,
  savedCrosshairs = [],
  onSaveCurrent,
  onDeleteSaved,
  onShowToast,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'esports' | 'saved'
  const [searchQuery, setSearchQuery] = useState('');
  const [sharecodeModalOpen, setSharecodeModalOpen] = useState(false);
  const [sharecodeInput, setSharecodeInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [saveName, setSaveName] = useState('');

  const handleCopyCode = (preset, e) => {
    if (e) e.stopPropagation();
    const code = encodeSharecode(preset);
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedId(preset.id);
      if (onShowToast) onShowToast({ message: `Sharecode copied for "${preset.name}"`, type: 'success' });
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleImport = () => {
    if (!sharecodeInput.trim()) return;
    const decoded = decodeSharecode(sharecodeInput);
    if (decoded) {
      onSelectPreset({
        ...decoded,
        id: `custom-${Date.now()}`,
      });
      setSharecodeModalOpen(false);
      setSharecodeInput('');
      if (onShowToast) onShowToast({ message: 'Crosshair imported successfully!', type: 'success' });
    } else {
      if (onShowToast) onShowToast({ message: 'Invalid sharecode format!', type: 'error' });
    }
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    const newCrosshair = {
      ...currentConfig,
      id: `custom-${Date.now()}`,
      name: saveName.trim(),
    };
    onSaveCurrent(newCrosshair);
    setSaveName('');
    if (onShowToast) onShowToast({ message: `Saved "${newCrosshair.name}" to Vault`, type: 'success' });
  };

  const allPresets = [...savedCrosshairs, ...DEFAULT_PRESETS];

  const filteredPresets = allPresets.filter((p) => {
    const isSaved = savedCrosshairs.some((s) => s.id === p.id);
    if (filter === 'saved' && !isSaved) return false;
    if (filter === 'esports' && isSaved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchGame = (p.game || '').toLowerCase().includes(q);
      return matchName || matchGame;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] p-6 select-none overflow-hidden space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] shrink-0">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm border border-[var(--border-medium)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            All Reticles ({allPresets.length})
          </button>
          <button
            onClick={() => setFilter('esports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'esports'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm border border-[var(--border-medium)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            Pro Esports ({DEFAULT_PRESETS.length})
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'saved'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm border border-[var(--border-medium)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            Saved Vault ({savedCrosshairs.length})
          </button>
        </div>

        {/* Right Search & Share Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search crosshairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text pl-9 pr-3.5 py-2 text-xs w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setSharecodeModalOpen(true)}
            className="btn-secondary text-xs"
            title="Import an exported crosshair sharecode"
          >
            <Upload size={14} />
            <span className="hidden md:inline">Import</span>
          </button>

          <button
            onClick={(e) => handleCopyCode(currentConfig, e)}
            className="btn-primary text-xs"
            title="Copy current crosshair sharecode"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Quick Save Card */}
      <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center gap-3 shrink-0 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <Bookmark size={16} />
        </div>
        <span className="font-bold text-[var(--text-main)] text-xs whitespace-nowrap">Save Current:</span>
        <input
          type="text"
          placeholder="Give your crosshair a name..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="input-text flex-1 py-2 text-xs"
        />
        <button
          onClick={handleSave}
          disabled={!saveName.trim()}
          className="btn-primary text-xs disabled:opacity-40"
        >
          <Plus size={14} />
          <span>Save Preset</span>
        </button>
      </div>

      {/* Presets Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pr-1 pb-4">
        {filteredPresets.map((preset) => {
          const isSelected = currentConfig.id === preset.id;
          const isSaved = savedCrosshairs.some((s) => s.id === preset.id);
          const thumbSvg = generateCrosshairSVG(preset, { viewBoxSize: 80 });

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative rounded-2xl p-5 flex flex-col justify-between cursor-pointer border transition-all shadow-sm hover:shadow-lg ${
                isSelected
                  ? 'bg-[var(--bg-card)] border-[var(--accent)] ring-2 ring-[var(--accent)]/30'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {/* Top Details */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 pr-1">
                  <span className="font-bold text-sm text-[var(--text-main)] block truncate">
                    {preset.name}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-medium block mt-0.5 truncate">
                    {preset.game || (isSaved ? 'Custom Vault' : 'Pro Esports')}
                  </span>
                </div>

                {isSelected ? (
                  <span className="px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] font-bold text-[11px] flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    Active
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleCopyCode(preset, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer shrink-0"
                    title="Copy Sharecode"
                  >
                    {copiedId === preset.id ? (
                      <Check size={14} className="text-[var(--accent)]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>

              {/* Visual Vector Thumbnail Preview */}
              <div className="my-4 h-32 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center relative overflow-hidden group-hover:border-[var(--border-medium)] transition-colors shadow-inner">
                <div
                  className="pointer-events-none transition-transform duration-200 group-hover:scale-115"
                  dangerouslySetInnerHTML={{ __html: thumbSvg }}
                />
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-subtle)]">
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[var(--bg-input)] border border-[var(--border-subtle)] font-semibold text-[var(--text-secondary)]">
                  Scale: {(preset.scale || 1.0).toFixed(1)}x
                </span>

                <div className="flex items-center gap-2">
                  {isSaved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSaved(preset.id);
                        if (onShowToast) onShowToast({ message: `Deleted "${preset.name}"`, type: 'info' });
                      }}
                      className="p-1 rounded-md text-[var(--text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete saved crosshair"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity font-bold flex items-center gap-1 text-xs">
                    Apply <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sharecode Import Modal */}
      {sharecodeModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-medium)] p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[var(--text-main)]">Import Crosshair Code</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Paste an OpenCrosshair or Valorant profile sharecode string below:
                </p>
              </div>
              <button
                onClick={() => setSharecodeModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <textarea
              rows={4}
              value={sharecodeInput}
              onChange={(e) => setSharecodeInput(e.target.value)}
              placeholder="e.g., OCH-4,8,2,3,0,1,00FF00,1,1..."
              className="input-text w-full font-mono text-xs p-3.5 resize-none rounded-xl"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSharecodeModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!sharecodeInput.trim()}
                className="btn-primary text-xs disabled:opacity-40"
              >
                Import Crosshair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
