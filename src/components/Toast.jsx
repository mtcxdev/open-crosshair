import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
      {isSuccess && <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0" />}
      {isError && <AlertCircle size={16} className="text-rose-500 shrink-0" />}
      {!isSuccess && !isError && <Info size={16} className="text-cyan-400 shrink-0" />}
      
      <span className="text-xs font-medium tracking-tight">{toast.message}</span>

      <button
        onClick={onClose}
        className="ml-2 text-[var(--text-tertiary)] hover:text-[var(--text-main)] transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
