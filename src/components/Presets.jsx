import React, { useState } from 'react';
import { Bookmark, Copy, Check, Trash2, Download, Upload, Plus, Sparkles } from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { generateCrosshairSVG } from '../utils/svgGenerator';
import { encodeSharecode, decodeSharecode } from '../utils/sharecode';

export function Presets({ currentConfig, onSelectPreset, savedCrosshairs, onSaveCurrent, onDeleteSaved }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'esports' | 'saved'
  const [sharecodeModalOpen, setSharecodeModalOpen] = useState(false);
  const [sharecodeInput, setSharecodeInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [saveName, setSaveName] = useState('');

  const handleCopyCode = (preset) => {
    const code = encodeSharecode(preset);
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedId(preset.id);
      setTimeout(() => setCopiedId(null), 1500);
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
    } else {
      alert('Invalid sharecode format! Please check the code.');
    }
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    onSaveCurrent({
      ...currentConfig,
      id: `custom-${Date.now()}`,
      name: saveName.trim(),
    });
    setSaveName('');
  };

  const displayedPresets = filter === 'saved'
    ? savedCrosshairs
    : filter === 'esports'
    ? DEFAULT_PRESETS
    : [...savedCrosshairs, ...DEFAULT_PRESETS];

  return (
    <div className="flex flex-col h-full bg-[#0A0B0E] p-4 select-none font-mono text-xs">
      {/* Action Bar */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#262A3B]">
        {/* Filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 border text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            ALL ({savedCrosshairs.length + DEFAULT_PRESETS.length})
          </button>
          <button
            onClick={() => setFilter('esports')}
            className={`px-3 py-1 border text-xs font-bold transition-all ${
              filter === 'esports'
                ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            ESPORTS PROS ({DEFAULT_PRESETS.length})
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-3 py-1 border text-xs font-bold transition-all ${
              filter === 'saved'
                ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#12141C] text-[#8E95A5] border-[#262A3B] hover:text-white'
            }`}
          >
            SAVED VAULT ({savedCrosshairs.length})
          </button>
        </div>

        {/* Sharecode & Save Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSharecodeModalOpen(true)}
            className="brutal-btn py-1 px-2.5 text-xs bg-[#181B26] text-[#00F0FF] border-[#262A3B] hover:border-[#00F0FF]"
          >
            <Upload size={12} />
            IMPORT SHARECODE
          </button>
          <button
            onClick={() => handleCopyCode(currentConfig)}
            className="brutal-btn py-1 px-2.5 text-xs bg-[#181B26] text-[#CCFF00] border-[#262A3B] hover:border-[#CCFF00]"
          >
            <Copy size={12} />
            {copiedId === currentConfig.id ? 'COPIED!' : 'SHARE CURRENT'}
          </button>
        </div>
      </div>

      {/* Quick Save Bar */}
      <div className="my-3 p-2 bg-[#12141C] border border-[#262A3B] flex items-center gap-2">
        <Bookmark size={14} className="text-[#CCFF00] ml-1" />
        <span className="text-[#8E95A5] uppercase font-bold text-[11px]">SAVE TO VAULT:</span>
        <input
          type="text"
          placeholder="ENTER PRESET NAME..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          className="brutal-input flex-1 py-1 text-xs"
        />
        <button
          onClick={handleSave}
          disabled={!saveName.trim()}
          className="brutal-btn py-1 px-3 text-xs disabled:opacity-50"
        >
          <Plus size={13} />
          SAVE
        </button>
      </div>

      {/* Presets Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
        {displayedPresets.map((preset) => {
          const isSelected = currentConfig.id === preset.id;
          const thumbSvg = generateCrosshairSVG(preset, { viewBoxSize: 80 });

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`relative brutal-card p-3 flex flex-col justify-between cursor-pointer transition-all group ${
                isSelected
                  ? 'border-[#CCFF00] shadow-[3px_3px_0px_#CCFF00]'
                  : 'hover:border-[#8E95A5]'
              }`}
            >
              {/* Top Meta */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-xs text-white block truncate max-w-[140px]">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-[#8E95A5] block">
                    {preset.game || 'Custom'}
                  </span>
                </div>

                {isSelected && (
                  <span className="brutal-badge text-[9px]">ACTIVE</span>
                )}
              </div>

              {/* Crosshair Thumbnail Canvas */}
              <div
                className="my-3 h-24 bg-[#0A0B0E] border border-[#262A3B] flex items-center justify-center relative overflow-hidden group-hover:border-[#CCFF00]/40 transition-colors"
                style={{
                  backgroundImage: 'radial-gradient(circle, #1F2333 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              >
                <div
                  className="pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: thumbSvg }}
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#262A3B] text-[10px] text-[#8E95A5]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode(preset);
                  }}
                  className="hover:text-[#CCFF00] flex items-center gap-1"
                >
                  {copiedId === preset.id ? <Check size={11} className="text-[#CCFF00]" /> : <Copy size={11} />}
                  <span>{copiedId === preset.id ? 'COPIED' : 'CODE'}</span>
                </button>

                {preset.id.startsWith('custom-') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSaved(preset.id);
                    }}
                    className="hover:text-[#FF0055] transition-colors"
                    title="Delete preset"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sharecode Modal */}
      {sharecodeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="brutal-card w-full max-w-md p-4 bg-[#12141C] border-2 border-[#CCFF00] shadow-[6px_6px_0px_#000] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#262A3B]">
              <span className="font-bold text-sm text-[#CCFF00]">IMPORT CROSSHAIR SHARECODE</span>
              <button
                onClick={() => setSharecodeModalOpen(false)}
                className="text-[#8E95A5] hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-[#8E95A5] text-[11px]">
              Paste any <code className="text-[#CCFF00]">OC-...</code> sharecode below to load it into your studio offline.
            </p>

            <textarea
              rows={4}
              value={sharecodeInput}
              onChange={(e) => setSharecodeInput(e.target.value)}
              placeholder="PASTE SHARECODE (e.g. OC-eyJhbGciOi...)"
              className="brutal-input w-full resize-none font-mono text-xs"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSharecodeModalOpen(false)}
                className="brutal-btn py-1.5 px-3 bg-[#181B26] text-[#8E95A5] border-[#262A3B]"
              >
                CANCEL
              </button>
              <button
                onClick={handleImport}
                disabled={!sharecodeInput.trim()}
                className="brutal-btn py-1.5 px-4 disabled:opacity-50"
              >
                IMPORT NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
