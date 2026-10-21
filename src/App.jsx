import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crosshair,
  LayoutGrid,
  Gamepad2,
  Monitor,
  Settings2,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Minus,
  Square,
  X,
  Minimize2,
} from 'lucide-react';
import { CrosshairPreview } from './components/CrosshairPreview';
import { LayerEditor } from './components/LayerEditor';
import { Presets } from './components/Presets';
import { GameProfiles } from './components/GameProfiles';
import { OverlayHub } from './components/OverlayHub';
import { SettingsModal } from './components/SettingsModal';
import { DonationModal } from './components/DonationModal';
import { Toast } from './components/Toast';
import { DEFAULT_PRESETS } from './constants/defaultPresets';
import { generateCrosshairSVG } from './utils/svgGenerator';

const NAV_TABS = [
  { id: 'studio', label: 'Studio', icon: Crosshair },
  { id: 'presets', label: 'Presets', icon: LayoutGrid },
  { id: 'games', label: 'Game Profiles', icon: Gamepad2 },
  { id: 'overlay', label: 'Overlay & OBS', icon: Monitor },
];

export function App() {
  const [activeNav, setActiveNav] = useState('studio');
  const [crosshairConfig, setCrosshairConfig] = useState(DEFAULT_PRESETS[0]);
  const [savedCrosshairs, setSavedCrosshairs] = useState([]);
  const [gameProfiles, setGameProfiles] = useState([]);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [displays, setDisplays] = useState([]);
  const [selectedDisplayId, setSelectedDisplayId] = useState(null);
  const [activeFocusedProfile, setActiveFocusedProfile] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [streamerInfo, setStreamerInfo] = useState({ port: 3175, url: 'http://localhost:3175', preferredPort: 3175 });
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('och_theme') || 'dark');
  const [accent, setAccent] = useState(() => localStorage.getItem('och_accent') || 'emerald');
  const [uiScale, setUiScale] = useState(() => {
    const saved = localStorage.getItem('och_ui_scale');
    return saved ? Number(saved) : 100;
  });
  const [isMaximized, setIsMaximized] = useState(false);

  const historyRef = useRef([DEFAULT_PRESETS[0]]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const showToast = useCallback((data) => {
    setToast(data);
    if (data.duration !== 0) {
      setTimeout(() => setToast((old) => (old === data ? null : old)), data.duration || 3000);
    }
  }, []);

  // Sync theme, accent, and UI scale
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    );
    const scaleVal = (uiScale || 100) / 100;
    document.documentElement.style.setProperty('--ui-scale', String(scaleVal));
    document.documentElement.style.fontSize = `${14.5 * scaleVal}px`;
    localStorage.setItem('och_accent', accent);
    localStorage.setItem('och_theme', theme);
    localStorage.setItem('och_ui_scale', String(uiScale));
  }, [theme, accent, uiScale]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event) =>
      document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [theme]);

  // Load store and listeners
  useEffect(() => {
    if (!window.api) return;
    window.api.getStore().then((data) => {
      if (!data) return;
      if (data.activeCrosshair) {
        setCrosshairConfig(data.activeCrosshair);
        historyRef.current = [data.activeCrosshair];
      }
      if (data.savedCrosshairs) setSavedCrosshairs(data.savedCrosshairs);
      if (data.gameProfiles) setGameProfiles(data.gameProfiles);
      if (data.settings) {
        setOverlayEnabled(data.settings.overlayEnabled !== false);
        setSelectedDisplayId(data.settings.selectedDisplayId);
        if (data.settings.theme) setTheme(data.settings.theme);
        if (data.settings.accent) setAccent(data.settings.accent);
        if (data.settings.uiScale) setUiScale(data.settings.uiScale);
      }
    });

    window.api.isMaximized?.().then((max) => setIsMaximized(!!max));
    window.api.onMaximizeChanged?.((max) => setIsMaximized(!!max));

    window.api.getDisplays().then((items) => {
      if (items) setDisplays(items);
    });
    window.api.onGameSwitched(({ profile, crosshair }) => {
      setActiveFocusedProfile(profile);
      if (crosshair) {
        setCrosshairConfig(crosshair);
        showToast({
          message: `Switched to ${profile.gameName || profile.processName}`,
          type: 'success',
        });
      }
    });
    window.api.onOverlayStateChanged(setOverlayEnabled);
    window.api.onCrosshairRecentered((next) => {
      setCrosshairConfig(next);
      showToast({ message: 'Crosshair centered', type: 'info' });
    });
    window.api.getStreamerInfo?.().then((info) => {
      if (info) setStreamerInfo(info);
    });
    window.api.onStreamerPortBound?.((info) => {
      if (info) setStreamerInfo(info);
    });
  }, [showToast]);

  const pushHistory = useCallback((next) => {
    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(next);
    if (history.length > 50) history.shift();
    historyRef.current = history;
    historyIndexRef.current = history.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const syncConfig = (config) =>
    window.api?.updateCrosshair({
      ...config,
      svg: generateCrosshairSVG(config, { viewBoxSize: 128 }),
    });

  const handleConfigChange = (next, record = true) => {
    setCrosshairConfig(next);
    if (record) pushHistory(next);
    syncConfig(next);
  };

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    const i = --historyIndexRef.current;
    const next = historyRef.current[i];
    setCrosshairConfig(next);
    setCanUndo(i > 0);
    setCanRedo(true);
    window.api?.updateCrosshair({
      ...next,
      svg: generateCrosshairSVG(next, { viewBoxSize: 128 }),
    });
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const i = ++historyIndexRef.current;
    const next = historyRef.current[i];
    setCrosshairConfig(next);
    setCanUndo(true);
    setCanRedo(i < historyRef.current.length - 1);
    window.api?.updateCrosshair({
      ...next,
      svg: generateCrosshairSVG(next, { viewBoxSize: 128 }),
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleUndo, handleRedo]);

  const handleToggleOverlay = () => {
    if (window.api) {
      window.api.toggleOverlay().then((next) => {
        setOverlayEnabled(next);
        showToast({
          message: `Overlay ${next ? 'enabled' : 'disabled'}`,
          type: next ? 'success' : 'info',
        });
      });
    } else {
      const next = !overlayEnabled;
      setOverlayEnabled(next);
      showToast({ message: `Overlay ${next ? 'enabled' : 'disabled'}`, type: 'info' });
    }
  };

  const handleSelectDisplay = (id) => {
    setSelectedDisplayId(id);
    window.api?.selectDisplay(id);
    showToast({ message: 'Display target updated', type: 'success' });
  };

  const handleSaveCurrent = (item) =>
    window.api
      ? window.api.saveCrosshair(item).then(setSavedCrosshairs)
      : setSavedCrosshairs((list) => [item, ...list]);

  const handleDeleteSaved = (id) =>
    window.api
      ? window.api.deleteCrosshair(id).then(setSavedCrosshairs)
      : setSavedCrosshairs((list) => list.filter((item) => item.id !== id));

  const handleSaveGameProfiles = (items) => {
    setGameProfiles(items);
    window.api?.saveGameProfiles(items);
  };

  const handleRecenter = () => {
    handleConfigChange({ ...crosshairConfig, offsetX: 0, offsetY: 0 });
    showToast({ message: 'Crosshair centered to (0, 0)', type: 'success' });
  };

  const handleResetDefaults = () => {
    handleConfigChange(DEFAULT_PRESETS[0]);
    setSettingsOpen(false);
    showToast({ message: 'Default reticle restored', type: 'info' });
  };

  const handleChangeStreamerPort = async (port) => {
    if (window.api?.setStreamerPort) {
      const info = await window.api.setStreamerPort(port);
      if (info) setStreamerInfo(info);
    }
  };

  const isDesktop = typeof window !== 'undefined' && !!window.api;

  return (
    <div className="w-screen h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden font-sans select-none">
      {/* Top Application Navbar */}
      <header
        className="h-14 flex items-center justify-between px-5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shrink-0 z-30"
        style={isDesktop ? { WebkitAppRegion: 'drag' } : {}}
      >
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 shrink-0" style={isDesktop ? { WebkitAppRegion: 'no-drag' } : {}}>
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center shadow-md">
            <Crosshair size={18} strokeWidth={2.4} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-[var(--text-main)]">
              Open<span className="text-[var(--accent)]">Crosshair</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              v1.4.1
            </span>
          </div>
        </div>

        {/* Centered Modern Navigation Tabs */}
        <nav
          className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]"
          style={isDesktop ? { WebkitAppRegion: 'no-drag' } : {}}
        >
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm border border-[var(--border-medium)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Icon size={14} className={isActive ? 'stroke-[2.5]' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-2 shrink-0" style={isDesktop ? { WebkitAppRegion: 'no-drag' } : {}}>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Undo (Ctrl + Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Redo (Ctrl + Y)"
          >
            <Redo2 size={15} />
          </button>

          <span className="w-px h-5 bg-[var(--border-medium)] mx-1" />

          {/* Overlay Status Pill */}
          <button
            onClick={handleToggleOverlay}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
              overlayEnabled
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent)]'
                : 'bg-[var(--bg-card)] border-[var(--border-medium)] text-[var(--text-secondary)]'
            }`}
            title="Toggle crosshair overlay on your game screen"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                overlayEnabled ? 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse' : 'bg-neutral-500'
              }`}
            />
            <span>{overlayEnabled ? 'Overlay Active' : 'Overlay Hidden'}</span>
            {overlayEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>

          <button
            onClick={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all cursor-pointer"
            title="Settings & Scaling"
          >
            <Settings2 size={16} />
          </button>

          {/* Desktop-Only Window Action Controls (Hidden in browser) */}
          {isDesktop && (
            <div className="flex items-center gap-1 pl-2 border-l border-[var(--border-subtle)]">
              <button
                onClick={() => window.api?.minimize?.()}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] cursor-pointer"
                title="Minimize"
              >
                <Minus size={13} />
              </button>
              <button
                onClick={() => {
                  window.api?.maximize?.();
                  setIsMaximized((v) => !v);
                }}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] cursor-pointer"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 size={12} /> : <Square size={11} />}
              </button>
              <button
                onClick={() => window.api?.close?.()}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-rose-600 cursor-pointer"
                title="Close to Tray"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Viewport */}
      <main className="flex-1 min-h-0 p-5 overflow-hidden flex flex-col">
        {activeNav === 'studio' && (
          <div className="flex-1 min-h-0 grid grid-cols-[minmax(0,1.25fr)_minmax(420px,480px)] gap-5 h-full">
            {/* Left: Crosshair Preview Canvas */}
            <div className="min-h-0 h-full flex flex-col">
              <CrosshairPreview
                config={crosshairConfig}
                onTriggerRecoil={(amount) => window.api?.triggerRecoil(amount)}
                onRecenter={handleRecenter}
              />
            </div>

            {/* Right: Design Controls Inspector */}
            <div className="min-h-0 h-full flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
              <LayerEditor config={crosshairConfig} onChange={handleConfigChange} />
            </div>
          </div>
        )}

        {activeNav === 'presets' && (
          <div className="flex-1 min-h-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden p-6 shadow-sm">
            <Presets
              currentConfig={crosshairConfig}
              onSelectPreset={(preset) => {
                handleConfigChange(preset);
                setActiveNav('studio');
                showToast({ message: `Applied "${preset.name}"`, type: 'success' });
              }}
              savedCrosshairs={savedCrosshairs}
              onSaveCurrent={handleSaveCurrent}
              onDeleteSaved={handleDeleteSaved}
              onShowToast={showToast}
            />
          </div>
        )}

        {activeNav === 'games' && (
          <div className="flex-1 min-h-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden p-6 shadow-sm">
            <GameProfiles
              profiles={gameProfiles}
              onSaveProfiles={handleSaveGameProfiles}
              savedCrosshairs={savedCrosshairs}
              activeProfile={activeFocusedProfile}
              onShowToast={showToast}
            />
          </div>
        )}

        {activeNav === 'overlay' && (
          <div className="flex-1 min-h-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden p-6 shadow-sm">
            <OverlayHub
              overlayEnabled={overlayEnabled}
              onToggleOverlay={handleToggleOverlay}
              displays={displays}
              selectedDisplayId={selectedDisplayId}
              onSelectDisplay={handleSelectDisplay}
              streamerInfo={streamerInfo}
              onChangeStreamerPort={handleChangeStreamerPort}
              onShowToast={showToast}
            />
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentConfig={crosshairConfig}
        onResetDefaults={handleResetDefaults}
        theme={theme}
        onChangeTheme={setTheme}
        accent={accent}
        onChangeAccent={setAccent}
        uiScale={uiScale}
        onChangeUiScale={setUiScale}
        allData={{
          activeCrosshair: crosshairConfig,
          savedCrosshairs,
          gameProfiles,
          theme,
          accent,
          uiScale,
        }}
        onImportBackup={(backup) => {
          if (backup.activeCrosshair) handleConfigChange(backup.activeCrosshair);
          if (backup.savedCrosshairs) setSavedCrosshairs(backup.savedCrosshairs);
          if (backup.gameProfiles) setGameProfiles(backup.gameProfiles);
          if (backup.theme) setTheme(backup.theme);
          if (backup.accent) setAccent(backup.accent);
          if (backup.uiScale) setUiScale(backup.uiScale);
          window.api?.saveStore?.(backup);
        }}
        onShowToast={showToast}
        onOpenDonation={() => setDonationOpen(true)}
      />

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
