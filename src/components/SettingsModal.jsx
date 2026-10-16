import React from 'react';
import { Settings, Keyboard, MousePointer, Shield, Download, RefreshCw, X } from 'lucide-react';
import { generateCrosshairSVG } from '../utils/svgGenerator';

export function SettingsModal({ isOpen, onClose, currentConfig, onResetDefaults }) {
  if (!isOpen) return null;

  const handleDownloadSVG = () => {
    const svgStr = generateCrosshairSVG(currentConfig, { viewBoxSize: 128 });
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConfig.name.replace(/\s+/g, '_')}_crosshair.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none font-mono text-xs">
      <div className="brutal-card w-full max-w-xl bg-[#12141C] border-2 border-[#CCFF00] shadow-[6px_6px_0px_#000] p-4 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#262A3B]">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#CCFF00]" />
            <span className="font-bold text-sm text-white">SYSTEM & APPLICATION SETTINGS</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-[#262A3B] bg-[#181B26] hover:bg-[#FF0055] hover:text-white text-[#8E95A5]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Global Shortcuts */}
        <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Keyboard size={14} className="text-[#00F0FF]" />
            <span>GLOBAL HOTKEYS</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-1.5 bg-[#0A0B0E] border border-[#262A3B]">
              <span className="text-[#8E95A5]">TOGGLE OVERLAY VISIBILITY</span>
              <kbd className="px-2 py-0.5 bg-[#181B26] border border-[#262A3B] text-[#CCFF00] font-bold">
                Ctrl + Shift + X
              </kbd>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-[#0A0B0E] border border-[#262A3B]">
              <span className="text-[#8E95A5]">RE-CENTER OVERLAY PIXEL</span>
              <kbd className="px-2 py-0.5 bg-[#181B26] border border-[#262A3B] text-[#00F0FF] font-bold">
                Ctrl + Shift + C
              </kbd>
            </div>
          </div>
        </div>

        {/* Export Vector Crosshair */}
        <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <MousePointer size={14} className="text-[#CCFF00]" />
            <span>HARDWARE / SVG EXPORT</span>
          </div>
          <p className="text-[11px] text-[#8E95A5]">
            Export current crosshair as clean standalone SVG vector for laser cutters, graphic design, or Windows cursor converters.
          </p>
          <button
            onClick={handleDownloadSVG}
            className="brutal-btn py-1.5 px-3 text-xs bg-[#12141C] text-[#CCFF00] border-[#262A3B] hover:border-[#CCFF00]"
          >
            <Download size={13} />
            DOWNLOAD CROSSHAIR .SVG
          </button>
        </div>

        {/* Open Source & Security */}
        <div className="p-3 bg-[#181B26] border border-[#262A3B] space-y-1 text-[11px] text-[#8E95A5]">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Shield size={14} className="text-[#00FF66]" />
            <span>100% OPEN SOURCE & SAFE</span>
          </div>
          <p>
            • No subscriptions, telemetry trackers, or internet requirements.<br />
            • Operates as a transparent desktop overlay with zero memory injection.<br />
            • Completely anti-cheat friendly (VAC, Vanguard, Easy Anti-Cheat, BattlEye).
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#262A3B]">
          <button
            onClick={onResetDefaults}
            className="text-[#FF0055] hover:underline text-[11px] flex items-center gap-1"
          >
            <RefreshCw size={11} />
            RESET ALL SETTINGS TO DEFAULT
          </button>
          <button
            onClick={onClose}
            className="brutal-btn py-1.5 px-4"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
