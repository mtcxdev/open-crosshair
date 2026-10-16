import React from 'react';
import {
  Crosshair,
  LayoutGrid,
  Gamepad2,
  Tv,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export function Sidebar({ activeNav, onSelectNav, theme, onToggleTheme, onOpenSettings }) {
  const navItems = [
    { id: 'studio', label: 'Studio', icon: Crosshair },
    { id: 'presets', label: 'Presets', icon: LayoutGrid },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'overlay', label: 'Overlay', icon: Tv },
  ];

  return (
    <aside className="w-16 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col items-center justify-between py-3.5 select-none shrink-0 z-20">
      {/* Main Nav Items */}
      <div className="flex flex-col gap-1.5 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              className={`group relative w-full h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
              }`}
              title={item.label}
            >
              {/* Active Left Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              )}
              <Icon size={18} className={`transition-transform duration-150 ${isActive ? 'scale-105 stroke-[2.2]' : 'group-hover:scale-105'}`} />
              <span className="text-[10px] tracking-tight mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Nav / Settings & Theme Toggle */}
      <div className="flex flex-col gap-1.5 w-full px-2">
        {/* Quick Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-full h-10 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={`w-full h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeNav === 'settings'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
          }`}
          title="Application Settings"
        >
          <SettingsIcon size={17} />
          <span className="text-[10px] tracking-tight mt-1">Settings</span>
        </button>
      </div>
    </aside>
  );
}
