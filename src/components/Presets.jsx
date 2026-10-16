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
  ArrowRight
} from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { generateCrosshairSVG } from '../utils/svgGenerator';
import { encodeSharecode, decodeSharecode } from '../utils/sharecode';

export function Presets({
  currentConfig,
  onSelectPreset,
  savedCrosshairs,
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
    // Filter tab
    const isSaved = savedCrosshairs.some((s) => s.id === p.id);
    if (filter === 'saved' && !isSaved) return false;
    if (filter === 'esports' && isSaved) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchGame = (p.game || '').toLowerCase().includes(q);
      return matchName || matchGame;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)] p-5 select-none text-xs space-y-4 overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            All ({allPresets.length})
          </button>
          <button
            onClick={() => setFilter('esports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'esports'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            Pro Esports ({DEFAULT_PRESETS.length})
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'saved'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            Saved Vault ({savedCrosshairs.length})
          </button>
        </div>

        {/* Right Search & Share Actions */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search crosshairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text pl-8 pr-3 py-1.5 text-xs w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => setSharecodeModalOpen(true)}
            className="btn-secondary text-xs"
            title="Import an exported crosshair sharecode"
          >
            <Upload size={13} />
            <span className="hidden md:inline">Import</span>
          </button>

          <button
            onClick={(e) => handleCopyCode(currentConfig, e)}
            className="btn-primary text-xs"
            title="Copy current crosshair sharecode"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Quick Save Card */}
      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5 shrink-0">
        <Bookmark size={15} className="text-[var(--accent)] ml-1" />
        <span className="font-medium text-[var(--text-secondary)] text-xs whitespace-nowrap">Save Current:</span>
        <input
          type="text"
          placeholder="Give your crosshair a name..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="input-text flex-1 py-1 text-xs"
        />
        <button
          onClick={handleSave}
          disabled={!saveName.trim()}
          className="btn-primary text-xs disabled:opacity-40"
        >
          <Plus size={13} />
          <span>Save Preset</span>
        </button>
      </div>

      {/* Presets Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pr-1">
        {filteredPresets.map((preset) => {
          const isSelected = currentConfig.id === preset.id;
          const isSaved = savedCrosshairs.some((s) => s.id === preset.id);
          const thumbSvg = generateCrosshairSVG(preset, { viewBoxSize: 80 });

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative rounded-xl p-3.5 flex flex-col justify-between cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {/* Top Details */}
              <div className="flex items-start justify-between gap-1">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-main)] block truncate max-w-[140px]">
                    {preset.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)] block">
                    {preset.game || (isSaved ? 'Custom' : 'Pro')}
                  </span>
                </div>

                {isSelected ? (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    Active
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleCopyCode(preset, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-all"
                    title="Copy Sharecode"
                  >
                    {copiedId === preset.id ? (
                      <Check size={13} className="text-[var(--accent)]" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                )}
              </div>

              {/* Visual Vector Thumbnail Preview */}
              <div className="my-3 py-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center h-24 overflow-hidden relative group-hover:border-[var(--border-medium)] transition-colors">
                <div
                  className="pointer-events-none transition-transform duration-150 group-hover:scale-110"
                  dangerouslySetInnerHTML={{ __html: thumbSvg }}
                />
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-1">
                <span className="font-mono text-[10px]">
                  Scale: {(preset.scale || 1.0).toFixed(1)}x
                </span>

                <div className="flex items-center gap-1">
                  {isSaved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSaved(preset.id);
                        if (onShowToast) onShowToast({ message: `Deleted "${preset.name}"`, type: 'info' });
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-tertiary)] hover:text-rose-400 transition-colors"
                      title="Delete saved crosshair"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-0.5">
                    Apply <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sharecode Import Modal */}
      {sharecodeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md card-elevated p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-[var(--text-main)]">Import Crosshair Code</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Paste an OpenCrosshair or Valorant profile sharecode string below:
              </p>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. OCH1;lines.length:7;lines.color:#00F0FF;..."
              value={sharecodeInput}
              onChange={(e) => setSharecodeInput(e.target.value)}
              className="input-text w-full font-mono text-xs p-2.5 resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSharecodeModalOpen(false)}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!sharecodeInput.trim()}
                className="btn-primary text-xs disabled:opacity-40"
              >
                Import & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
