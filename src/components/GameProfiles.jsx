import React, { useState } from 'react';
import { Gamepad2, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';

export function GameProfiles({ profiles, onSaveProfiles, savedCrosshairs, activeProfile }) {
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
    setNewExe('');
    setNewGame('');
  };

  const handleDelete = (index) => {
    const updated = profiles.filter((_, i) => i !== index);
    onSaveProfiles(updated);
  };

  const handleCrosshairChange = (index, crosshairId) => {
    const updated = [...profiles];
    updated[index].crosshairId = crosshairId;
    onSaveProfiles(updated);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0B0E] p-4 select-none font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#262A3B]">
        <div className="flex items-center gap-2">
          <Gamepad2 size={18} className="text-[#CCFF00]" />
          <div>
            <h2 className="font-bold text-sm text-white">GAME AUTO-PROFILE SWITCHER</h2>
            <p className="text-[11px] text-[#8E95A5]">
              Automatically switches your crosshair when games launch or take foreground focus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#12141C] border border-[#262A3B] px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
          <span className="text-[11px] text-[#CCFF00] font-bold">DETECTION ENGINE: ACTIVE</span>
        </div>
      </div>

      {/* Add New Profile Bar */}
      <div className="my-3 p-3 bg-[#12141C] border border-[#262A3B] space-y-2">
        <span className="font-bold text-white block text-[11px]">ADD GAME ASSOCIATION:</span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="PROCESS (e.g. cs2.exe)"
            value={newExe}
            onChange={(e) => setNewExe(e.target.value)}
            className="brutal-input text-xs"
          />
          <input
            type="text"
            placeholder="GAME TITLE (e.g. CS2)"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
            className="brutal-input text-xs"
          />
          <select
            value={newCrosshairId}
            onChange={(e) => setNewCrosshairId(e.target.value)}
            className="brutal-input text-xs cursor-pointer"
          >
            {allPresets.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#12141C] text-white">
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newExe.trim() || !newGame.trim()}
            className="brutal-btn py-1.5 text-xs disabled:opacity-50"
          >
            <Plus size={13} />
            ADD MAPPING
          </button>
        </div>
      </div>

      {/* Profile List Table */}
      <div className="flex-1 overflow-y-auto brutal-card border-2 border-[#262A3B]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#262A3B] bg-[#0E1017] text-[#8E95A5] text-[10px]">
              <th className="p-3">STATUS</th>
              <th className="p-3">PROCESS NAME</th>
              <th className="p-3">GAME TITLE</th>
              <th className="p-3">ASSIGNED CROSSHAIR</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p, idx) => {
              const isCurrentlyActive = activeProfile?.processName?.toLowerCase() === p.processName?.toLowerCase();
              return (
                <tr
                  key={idx}
                  className={`border-b border-[#262A3B] transition-colors ${
                    isCurrentlyActive ? 'bg-[#CCFF00]/10' : 'hover:bg-[#181B26]'
                  }`}
                >
                  <td className="p-3">
                    {isCurrentlyActive ? (
                      <span className="brutal-badge text-[9px] bg-[#CCFF00] text-black">
                        FOCUSED
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8E95A5]">STANDBY</span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-white">
                    {p.processName}
                  </td>
                  <td className="p-3 text-[#00F0FF]">
                    {p.gameName}
                  </td>
                  <td className="p-3">
                    <select
                      value={p.crosshairId}
                      onChange={(e) => handleCrosshairChange(idx, e.target.value)}
                      className="bg-[#0A0B0E] border border-[#262A3B] text-white px-2 py-1 text-xs outline-none cursor-pointer"
                    >
                      {allPresets.map((preset) => (
                        <option key={preset.id} value={preset.id} className="bg-[#12141C]">
                          {preset.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(idx)}
                      className="text-[#8E95A5] hover:text-[#FF0055] transition-colors p-1"
                      title="Delete profile mapping"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
