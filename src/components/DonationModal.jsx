import React, { useState } from 'react';
import {
  Heart,
  Coffee,
  Coins,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function DonationModal({ isOpen, onClose, onShowToast }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const openLink = (url) => {
    if (typeof window !== 'undefined' && window.api?.openExternal) {
      window.api.openExternal(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const copyToClipboard = (key, text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
    if (onShowToast) {
      onShowToast({
        message: `${label} address copied to clipboard!`,
        type: 'success',
      });
    }
  };

  const cryptoAddresses = [
    {
      id: 'btc',
      name: 'Bitcoin (BTC)',
      address: 'bc1q9h60032l84p3n8y793r33q604v0n70vxq3h888',
      color: '#F7931A',
    },
    {
      id: 'eth',
      name: 'Ethereum / USDT (ERC20)',
      address: '0x71C94bCde17D9a572c6F255a6d36e2f1704D1B99',
      color: '#627EEA',
    },
    {
      id: 'sol',
      name: 'Solana (SOL)',
      address: '7NxU5p5aZ9L7w2GvB98VwM84V8xV546Zk48N9x2kG5v1',
      color: '#14F195',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none text-xs">
      <div className="w-full max-w-lg card-elevated p-5 space-y-4 shadow-2xl border border-[var(--border-medium)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-sm">
              <Heart size={16} className="fill-rose-500/20" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-1.5">
                Support OpenCrosshair
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-normal">
                  Community Funded
                </span>
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                100% Free • Open Source • Zero Telemetry • Offline Forever
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Community Message */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[var(--accent)] font-medium text-xs">
            <Sparkles size={13} />
            <span>Why Donate?</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            OpenCrosshair was built to free gamers from predatory subscriptions, accounts, and bloated proprietary overlay tools. Your generous support funds continuous updates, game detection profiles, and multiplatform binary releases!
          </p>
        </div>

        {/* Sponsor & Tip Links */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-[var(--text-secondary)] block">
            Direct Funding Platforms:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openLink('https://github.com/sponsors/mtcxdev')}
              className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-main)]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs text-[var(--text-main)]">GitHub Sponsors</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Monthly or one-time</div>
                </div>
              </div>
              <ExternalLink size={13} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
            </button>

            <button
              onClick={() => openLink('https://buymeacoffee.com/mtcxdev')}
              className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-amber-400 hover:bg-[var(--bg-surface-hover)] flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Coffee size={15} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs text-[var(--text-main)]">Buy Me a Coffee</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Quick micro-tip</div>
                </div>
              </div>
              <ExternalLink size={13} className="text-[var(--text-secondary)] group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Crypto Tip Addresses */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
            <Coins size={13} className="text-[var(--accent)]" />
            <span>Crypto Support (One-Click Copy):</span>
          </span>

          <div className="space-y-1.5">
            {cryptoAddresses.map((c) => {
              const isCopied = copiedKey === c.id;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-[11px] text-[var(--text-main)]">{c.name}</div>
                      <div className="text-[10px] font-mono text-[var(--text-secondary)] truncate max-w-[280px]">
                        {c.address}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(c.id, c.address, c.name)}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 shrink-0 transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={11} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Thank you for keeping open source alive!</span>
          </div>
          <button onClick={onClose} className="btn-primary text-xs px-4">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
