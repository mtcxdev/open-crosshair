import React, { useState } from 'react';
import { Radio, Copy, Check, ExternalLink, ShieldCheck, Video } from 'lucide-react';

export function StreamerHub() {
  const [copied, setCopied] = useState(false);
  const streamUrl = 'http://localhost:3175';

  const handleCopy = () => {
    navigator.clipboard.writeText(streamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0B0E] p-4 select-none font-mono text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#262A3B]">
        <div className="flex items-center gap-2">
          <Video size={18} className="text-[#CCFF00]" />
          <div>
            <h2 className="font-bold text-sm text-white">OBS & STREAMLABS STREAMER HUB</h2>
            <p className="text-[11px] text-[#8E95A5]">
              Capture your crosshair cleanly in OBS Studio without window capture lag or anti-cheat conflicts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#12141C] border border-[#262A3B] px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
          <span className="text-[11px] text-[#00F0FF] font-bold">PORT 3175 ONLINE</span>
        </div>
      </div>

      {/* URL Banner */}
      <div className="brutal-card p-4 border-2 border-[#00F0FF] bg-[#12141C] space-y-2">
        <span className="font-bold text-white text-xs block">OBS BROWSER SOURCE URL:</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={streamUrl}
            className="brutal-input flex-1 font-bold text-sm text-[#00F0FF]"
          />
          <button
            onClick={handleCopy}
            className="brutal-btn py-2 px-4 bg-[#00F0FF] text-black"
          >
            {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY URL'}
          </button>
        </div>
      </div>

      {/* Setup Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="brutal-card p-3 bg-[#181B26] border border-[#262A3B] space-y-1.5">
          <div className="flex items-center gap-2 text-[#CCFF00] font-bold">
            <span className="brutal-badge">STEP 1</span>
            <span>ADD SOURCE</span>
          </div>
          <p className="text-[#8E95A5] text-[11px] leading-relaxed">
            In OBS Studio, click <strong className="text-white">+ Sources</strong> and select <strong className="text-white">Browser</strong>. Name it <code className="text-[#CCFF00]">Crosshair</code>.
          </p>
        </div>

        <div className="brutal-card p-3 bg-[#181B26] border border-[#262A3B] space-y-1.5">
          <div className="flex items-center gap-2 text-[#CCFF00] font-bold">
            <span className="brutal-badge">STEP 2</span>
            <span>PASTE URL & SIZE</span>
          </div>
          <p className="text-[#8E95A5] text-[11px] leading-relaxed">
            Set URL to <code className="text-[#00F0FF]">http://localhost:3175</code>. Set Width to <strong className="text-white">1920</strong> and Height to <strong className="text-white">1080</strong> (or your canvas resolution).
          </p>
        </div>

        <div className="brutal-card p-3 bg-[#181B26] border border-[#262A3B] space-y-1.5">
          <div className="flex items-center gap-2 text-[#CCFF00] font-bold">
            <span className="brutal-badge">STEP 3</span>
            <span>ZERO LAG SYNC</span>
          </div>
          <p className="text-[#8E95A5] text-[11px] leading-relaxed">
            Your crosshair automatically mirrors live with full vector crispness and transparent background.
          </p>
        </div>
      </div>

      {/* Technical Advantages */}
      <div className="p-3 bg-[#12141C] border border-[#262A3B] space-y-2">
        <span className="font-bold text-white text-xs block">STREAMER ADVANTAGES:</span>
        <ul className="list-disc list-inside space-y-1 text-[#8E95A5] text-[11px]">
          <li><strong className="text-white">100% Anti-Cheat Friendly:</strong> OBS connects to your local loopback, with zero injection into game memory.</li>
          <li><strong className="text-white">Streamer Clean Feed:</strong> You can show the crosshair only to your viewers, or use it when streaming games that hide desktop overlays.</li>
          <li><strong className="text-white">Hardware Accelerated:</strong> Consumes practically 0% CPU resources.</li>
        </ul>
      </div>
    </div>
  );
}
