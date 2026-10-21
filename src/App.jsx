import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crosshair,
  LayoutGrid,
  Gamepad2,
  Monitor,
  Settings2,
  Sun,
  Moon,
  Heart,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Minus,
  Square,
  X,
  Minimize2,
  Sliders,
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

const NAV = [
  { id: 'studio', label: 'Crosshair Studio', hint: 'Design & adjust', icon: Crosshair },
  { id: 'presets', label: 'Preset Library', hint: 'Browse crosshairs', icon: LayoutGrid },
  { id: 'games', label: 'Game Profiles', hint: 'Auto-switch per game', icon: Gamepad2 },
  { id: 'overlay', label: 'Overlay & OBS', hint: 'Screen & streaming', icon: Monitor },
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

  const handleMinimize = () => {
    window.api?.minimize?.();
  };

  const handleMaximize = () => {
    window.api?.maximize?.();
    setIsMaximized((prev) => !prev);
  };

  const handleClose = () => {
    window.api?.close?.();
  };

  const currentNav = NAV.find((item) => item.id === activeNav) || NAV[0];

  return (
    <div className="app-shell">
      {/* Top Titlebar */}
      <header className="app-topbar" style={{ WebkitAppRegion: 'drag' }}>
        <div className="brand-lockup">
          <div className="brand-mark">
            <Crosshair size={20} strokeWidth={2.4} />
          </div>
          <div className="brand-copy">
            <span className="brand-name">
              open<span>crosshair</span>
            </span>
          </div>
          <span className="version-chip">v1.4.1</span>
        </div>

        <div className="topbar-actions" style={{ WebkitAppRegion: 'no-drag' }}>
          <button
            className="icon-button"
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl + Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            className="icon-button"
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl + Y)"
          >
            <Redo2 size={16} />
          </button>

          <span className="topbar-divider" />

          <button
            className={`overlay-pill ${overlayEnabled ? 'is-live' : ''}`}
            onClick={handleToggleOverlay}
            title="Toggle overlay reticle on screen"
          >
            <span className="status-dot" />
            <span>{overlayEnabled ? 'Overlay Active' : 'Overlay Hidden'}</span>
            {overlayEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>

          {/* Desktop Window Action Controls */}
          <div className="window-controls">
            <button
              className="win-btn win-minimize"
              onClick={handleMinimize}
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              className="win-btn win-maximize"
              onClick={handleMaximize}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 size={12} /> : <Square size={11} />}
            </button>
            <button
              className="win-btn win-close"
              onClick={handleClose}
              title="Close to Tray"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar Navigation */}
        <aside className="app-sidebar">
          <nav className="nav-stack">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className="nav-icon">
                    <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                  </span>
                  <span className="nav-text">
                    <b>{item.label}</b>
                    <small>{item.hint}</small>
                  </span>
                  {active && <span className="nav-active-mark" />}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-spacer" />

          {/* Sidebar Utilities & Quick Controls */}
          <div className="sidebar-bottom">
            <button
              className="sidebar-utility"
              onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
              title="Toggle Dark / Light Theme"
            >
              <span className="utility-icon">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </span>
              <span>Theme</span>
              <span className="utility-value capitalize">{theme}</span>
            </button>

            <button
              className="sidebar-utility"
              onClick={() => setSettingsOpen(true)}
              title="Adjust UI scale and font size"
            >
              <span className="utility-icon">
                <Sliders size={16} />
              </span>
              <span>UI Scale</span>
              <span className="utility-value font-mono font-bold text-[var(--accent)]">{uiScale}%</span>
            </button>

            <button
              className="sidebar-utility"
              onClick={() => setSettingsOpen(true)}
              title="Application Settings"
            >
              <span className="utility-icon">
                <Settings2 size={16} />
              </span>
              <span>Settings</span>
              <span className="utility-shortcut">↗</span>
            </button>

            <button
              className="sidebar-utility text-rose-400 hover:text-rose-300"
              onClick={() => setDonationOpen(true)}
              title="Support OpenCrosshair"
            >
              <span className="utility-icon text-rose-400">
                <Heart size={16} className="fill-rose-500/20" />
              </span>
              <span>Donate</span>
              <span className="utility-shortcut">♥</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <span className="footer-avatar">OC</span>
            <div>
              <b>OpenCrosshair</b>
              <small>Offline & Safe</small>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="app-main">
          {activeNav === 'studio' ? (
            <div className="studio-container">
              {/* Sleek Compact Header */}
              <div className="studio-topbar">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">RETICLE:</span>
                    <span className="text-sm font-bold text-[var(--text-main)]">
                      {crosshairConfig.name || 'Custom Crosshair'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent)]">
                    {Number(crosshairConfig.scale || 1).toFixed(1)}× Scale
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRecenter}
                    className="btn-secondary text-xs py-1.5 px-3"
                    title="Center crosshair position to (0, 0)"
                  >
                    Center Reticle
                  </button>
                </div>
              </div>

              {/* Studio Grid: Canvas on Left, Controls on Right */}
              <section className="studio-layout">
                <div className="studio-preview-column">
                  <div className="preview-frame">
                    <CrosshairPreview
                      config={crosshairConfig}
                      onTriggerRecoil={(amount) => window.api?.triggerRecoil(amount)}
                      onRecenter={handleRecenter}
                    />
                  </div>
                  <div className="canvas-footer">
                    <div className="canvas-tip">
                      <span className="tip-key">LMB</span> Test Recoil <span className="tip-separator">/</span>{' '}
                      <span className="tip-key">RMB</span> Test ADS
                    </div>
                    <div className="canvas-readout">
                      <span>OFFSET:</span>
                      <b>
                        {crosshairConfig.offsetX || 0}, {crosshairConfig.offsetY || 0}
                      </b>
                    </div>
                  </div>
                </div>

                <div className="studio-inspector">
                  <div className="inspector-inner">
                    <LayerEditor config={crosshairConfig} onChange={handleConfigChange} />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="subpage-container">
              <div className="subpage-header">
                <h1 className="text-lg font-bold text-[var(--text-main)]">{currentNav.label}</h1>
                <p className="text-xs text-[var(--text-secondary)]">
                  {activeNav === 'presets'
                    ? 'Browse, apply, or import community and esports crosshairs.'
                    : activeNav === 'games'
                    ? 'Auto-switch crosshairs automatically when specific games launch.'
                    : 'Configure monitor displays and OBS streaming overlay.'}
                </p>
              </div>

              {activeNav === 'presets' && (
                <section className="subpage-panel">
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
                </section>
              )}

              {activeNav === 'games' && (
                <section className="subpage-panel">
                  <GameProfiles
                    profiles={gameProfiles}
                    onSaveProfiles={handleSaveGameProfiles}
                    savedCrosshairs={savedCrosshairs}
                    activeProfile={activeFocusedProfile}
                    onShowToast={showToast}
                  />
                </section>
              )}

              {activeNav === 'overlay' && (
                <section className="subpage-panel">
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
                </section>
              )}
            </div>
          )}
        </main>
      </div>

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

      <DonationModal
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
        onShowToast={showToast}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
