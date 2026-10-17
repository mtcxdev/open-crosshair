import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Crosshair, LayoutGrid, Gamepad2, Monitor, Settings2, Sun, Moon, Heart, Undo2, Redo2, Eye, EyeOff, SlidersHorizontal, Activity, Command, Sparkles } from 'lucide-react';
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
  { id: 'studio', label: 'Crosshair studio', short: 'STUDIO', hint: 'Build & tune', icon: Crosshair },
  { id: 'presets', label: 'Preset library', short: 'LIBRARY', hint: 'Find your look', icon: LayoutGrid },
  { id: 'games', label: 'Game profiles', short: 'PROFILES', hint: 'Auto-switch', icon: Gamepad2 },
  { id: 'overlay', label: 'Overlay & stream', short: 'OVERLAY', hint: 'Displays & OBS', icon: Monitor },
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
  const historyRef = useRef([DEFAULT_PRESETS[0]]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const showToast = useCallback((data) => { setToast(data); if (data.duration !== 0) setTimeout(() => setToast((old) => old === data ? null : old), data.duration || 3000); }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    document.documentElement.setAttribute('data-theme', theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme);
    localStorage.setItem('och_accent', accent); localStorage.setItem('och_theme', theme);
  }, [theme, accent]);
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event) => document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    mq.addEventListener('change', listener); return () => mq.removeEventListener('change', listener);
  }, [theme]);
  useEffect(() => {
    if (!window.api) return;
    window.api.getStore().then((data) => {
      if (!data) return;
      if (data.activeCrosshair) { setCrosshairConfig(data.activeCrosshair); historyRef.current = [data.activeCrosshair]; }
      if (data.savedCrosshairs) setSavedCrosshairs(data.savedCrosshairs);
      if (data.gameProfiles) setGameProfiles(data.gameProfiles);
      if (data.settings) { setOverlayEnabled(data.settings.overlayEnabled !== false); setSelectedDisplayId(data.settings.selectedDisplayId); if (data.settings.theme) setTheme(data.settings.theme); if (data.settings.accent) setAccent(data.settings.accent); }
    });
    window.api.getDisplays().then((items) => { if (items) setDisplays(items); });
    window.api.onGameSwitched(({ profile, crosshair }) => { setActiveFocusedProfile(profile); if (crosshair) { setCrosshairConfig(crosshair); showToast({ message: `Switched to ${profile.gameName || profile.processName}`, type: 'success' }); } });
    window.api.onOverlayStateChanged(setOverlayEnabled);
    window.api.onCrosshairRecentered((next) => { setCrosshairConfig(next); showToast({ message: 'Crosshair recentered', type: 'info' }); });
    window.api.getStreamerInfo?.().then((info) => { if (info) setStreamerInfo(info); });
    window.api.onStreamerPortBound?.((info) => { if (info) setStreamerInfo(info); });
  }, [showToast]);

  const pushHistory = useCallback((next) => {
    const history = historyRef.current.slice(0, historyIndexRef.current + 1); history.push(next);
    if (history.length > 50) history.shift();
    historyRef.current = history; historyIndexRef.current = history.length - 1;
    setCanUndo(historyIndexRef.current > 0); setCanRedo(false);
  }, []);
  const syncConfig = (config) => window.api?.updateCrosshair({ ...config, svg: generateCrosshairSVG(config, { viewBoxSize: 128 }) });
  const handleConfigChange = (next, record = true) => { setCrosshairConfig(next); if (record) pushHistory(next); syncConfig(next); };
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    const i = --historyIndexRef.current, next = historyRef.current[i]; setCrosshairConfig(next);
    setCanUndo(i > 0); setCanRedo(true); window.api?.updateCrosshair({ ...next, svg: generateCrosshairSVG(next, { viewBoxSize: 128 }) });
  }, []);
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const i = ++historyIndexRef.current, next = historyRef.current[i]; setCrosshairConfig(next);
    setCanUndo(true); setCanRedo(i < historyRef.current.length - 1); window.api?.updateCrosshair({ ...next, svg: generateCrosshairSVG(next, { viewBoxSize: 128 }) });
  }, []);
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); handleRedo(); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [handleUndo, handleRedo]);
  const handleToggleOverlay = () => {
    if (window.api) window.api.toggleOverlay().then((next) => { setOverlayEnabled(next); showToast({ message: `Overlay ${next ? 'enabled' : 'paused'}`, type: next ? 'success' : 'info' }); });
    else { const next = !overlayEnabled; setOverlayEnabled(next); showToast({ message: `Overlay ${next ? 'enabled' : 'paused'}`, type: 'info' }); }
  };
  const handleSelectDisplay = (id) => { setSelectedDisplayId(id); window.api?.selectDisplay(id); showToast({ message: 'Display target updated', type: 'success' }); };
  const handleSaveCurrent = (item) => window.api ? window.api.saveCrosshair(item).then(setSavedCrosshairs) : setSavedCrosshairs((list) => [item, ...list]);
  const handleDeleteSaved = (id) => window.api ? window.api.deleteCrosshair(id).then(setSavedCrosshairs) : setSavedCrosshairs((list) => list.filter((item) => item.id !== id));
  const handleSaveGameProfiles = (items) => { setGameProfiles(items); window.api?.saveGameProfiles(items); };
  const handleRecenter = () => { handleConfigChange({ ...crosshairConfig, offsetX: 0, offsetY: 0 }); showToast({ message: 'Crosshair centered', type: 'success' }); };
  const handleResetDefaults = () => { handleConfigChange(DEFAULT_PRESETS[0]); setSettingsOpen(false); showToast({ message: 'Factory defaults restored', type: 'info' }); };
  const handleChangeStreamerPort = async (port) => { if (window.api?.setStreamerPort) { const info = await window.api.setStreamerPort(port); if (info) setStreamerInfo(info); } };
  const currentNav = NAV.find((item) => item.id === activeNav) || NAV[0];
  const selectedDisplay = displays.find((item) => item.id === selectedDisplayId) || displays.find((item) => item.isPrimary);

  return <div className="app-shell">
    <header className="app-topbar" style={{ WebkitAppRegion: 'drag' }}>
      <div className="brand-lockup"><div className="brand-mark"><Crosshair size={20} strokeWidth={2.4} /></div><div className="brand-copy"><span className="brand-name">open<span>crosshair</span></span><span className="brand-caption">PRECISION WORKSPACE <i /></span></div><span className="version-chip">v1.3</span></div>
      <div className="topbar-center" style={{ WebkitAppRegion: 'no-drag' }}><span className="workspace-crumb">WORKSPACE <b>/</b> {currentNav.short}</span><span className="topbar-divider" /><span className="local-status"><i /> LOCAL ENGINE</span></div>
      <div className="topbar-actions" style={{ WebkitAppRegion: 'no-drag' }}><button className="icon-button" onClick={handleUndo} disabled={!canUndo} title="Undo · Ctrl Z"><Undo2 size={16} /></button><button className="icon-button" onClick={handleRedo} disabled={!canRedo} title="Redo · Ctrl Y"><Redo2 size={16} /></button><span className="topbar-divider" /><button className={`overlay-pill ${overlayEnabled ? 'is-live' : ''}`} onClick={handleToggleOverlay}><span className="status-dot" />{overlayEnabled ? 'Overlay live' : 'Overlay paused'}{overlayEnabled ? <Eye size={14} /> : <EyeOff size={14} />}</button></div>
    </header>
    <div className="app-body">
      <aside className="app-sidebar"><div className="sidebar-label">WORKSPACE</div><nav className="nav-stack">{NAV.map((item, index) => { const Icon = item.icon; const active = activeNav === item.id; return <button key={item.id} className={`nav-item ${active ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}><span className="nav-icon"><Icon size={18} strokeWidth={active ? 2.3 : 1.8} /></span><span className="nav-text"><b>{item.label}</b><small>{item.hint}</small></span>{active && <span className="nav-active-mark" />}<span className="nav-index">0{index + 1}</span></button>; })}</nav><div className="sidebar-spacer" /><div className="sidebar-card"><div className="sidebar-card-orbit"><Crosshair size={22} /></div><span className="sidebar-card-kicker">AIM WITH INTENT</span><p>Make every pixel count.</p><button onClick={() => setDonationOpen(true)}><Heart size={13} /> Support project</button></div><div className="sidebar-bottom"><button className="sidebar-utility" onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}><span className="utility-icon">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</span><span>Appearance</span><span className="utility-value">{theme === 'dark' ? 'Dark' : 'Light'}</span></button><button className="sidebar-utility" onClick={() => setSettingsOpen(true)}><span className="utility-icon"><Settings2 size={16} /></span><span>Preferences</span><span className="utility-shortcut">↗</span></button></div><div className="sidebar-footer"><span className="footer-avatar">OC</span><div><b>OpenCrosshair</b><small>Offline by design</small></div><span className="footer-live" /></div></aside>
      <main className="app-main"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL AIM LAB</div><h1>{currentNav.label}<span className="heading-period">.</span></h1><p>{activeNav === 'studio' ? 'Shape your perfect reticle. See every adjustment in real time.' : activeNav === 'presets' ? 'A curated starting point for your next perfect setup.' : activeNav === 'games' ? 'Give every game its own feel, automatically.' : 'Your display overlay and broadcast tools, in one place.'}</p></div><div className="heading-meta"><div className="meta-tile"><span className="meta-icon"><Crosshair size={15} /></span><div><small>ACTIVE DESIGN</small><b>{crosshairConfig.name || 'Custom reticle'}</b></div></div><div className="meta-tile"><span className="meta-icon"><LayoutGrid size={15} /></span><div><small>SAVED DESIGNS</small><b>{String(savedCrosshairs.length).padStart(2, '0')} <em>in library</em></b></div></div></div></div>
        {activeNav === 'studio' && <section className="studio-layout"><div className="studio-preview-column"><div className="section-overline"><span>01</span> LIVE CANVAS <span className="section-overline-rule" /><span className="live-preview"><i /> REAL-TIME PREVIEW</span></div><div className="preview-frame"><CrosshairPreview config={crosshairConfig} onTriggerRecoil={(amount) => window.api?.triggerRecoil(amount)} onRecenter={handleRecenter} /></div><div className="canvas-footer"><div className="canvas-tip"><span className="tip-key">LMB</span> Test recoil <span className="tip-separator">/</span> <span className="tip-key">RMB</span> Toggle ADS</div><div className="canvas-readout"><span>OFFSET</span><b>{crosshairConfig.offsetX || 0}, {crosshairConfig.offsetY || 0}</b><span className="readout-divider" /><span>SCALE</span><b>{Number(crosshairConfig.scale || 1).toFixed(1)}×</b></div></div></div><div className="studio-inspector"><div className="section-overline"><span>02</span> DESIGN CONTROLS <span className="section-overline-rule" /><SlidersHorizontal size={14} /></div><div className="inspector-inner"><LayerEditor config={crosshairConfig} onChange={handleConfigChange} /></div></div></section>}
        {activeNav === 'presets' && <section className="subpage-panel"><Presets currentConfig={crosshairConfig} onSelectPreset={(preset) => { handleConfigChange(preset); setActiveNav('studio'); showToast({ message: `Applied preset “${preset.name}”`, type: 'success' }); }} savedCrosshairs={savedCrosshairs} onSaveCurrent={handleSaveCurrent} onDeleteSaved={handleDeleteSaved} onShowToast={showToast} /></section>}
        {activeNav === 'games' && <section className="subpage-panel"><GameProfiles profiles={gameProfiles} onSaveProfiles={handleSaveGameProfiles} savedCrosshairs={savedCrosshairs} activeProfile={activeFocusedProfile} onShowToast={showToast} /></section>}
        {activeNav === 'overlay' && <section className="subpage-panel"><OverlayHub overlayEnabled={overlayEnabled} onToggleOverlay={handleToggleOverlay} displays={displays} selectedDisplayId={selectedDisplayId} onSelectDisplay={handleSelectDisplay} streamerInfo={streamerInfo} onChangeStreamerPort={handleChangeStreamerPort} onShowToast={showToast} /></section>}
        <footer className="workspace-footer"><span><Activity size={13} /> ALL CHANGES SYNC LIVE</span><span className="workspace-footer-right">{selectedDisplay ? <><Monitor size={13} /> {selectedDisplay.label || selectedDisplay.name || `Display ${selectedDisplay.id}`}</> : <><Sparkles size={13} /> Ready when you are</>}<span className="footer-divider" /><Command size={12} /> Z / Y</span></footer>
      </main>
    </div>
    <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} currentConfig={crosshairConfig} onResetDefaults={handleResetDefaults} theme={theme} onChangeTheme={setTheme} accent={accent} onChangeAccent={setAccent} allData={{ activeCrosshair: crosshairConfig, savedCrosshairs, gameProfiles, theme, accent }} onImportBackup={(backup) => { if (backup.activeCrosshair) handleConfigChange(backup.activeCrosshair); if (backup.savedCrosshairs) setSavedCrosshairs(backup.savedCrosshairs); if (backup.gameProfiles) setGameProfiles(backup.gameProfiles); if (backup.theme) setTheme(backup.theme); if (backup.accent) setAccent(backup.accent); window.api?.saveStore?.(backup); }} onShowToast={showToast} onOpenDonation={() => setDonationOpen(true)} />
    <DonationModal isOpen={donationOpen} onClose={() => setDonationOpen(false)} onShowToast={showToast} /><Toast toast={toast} onClose={() => setToast(null)} />
  </div>;
}
