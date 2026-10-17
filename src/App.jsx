import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
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

export function App() {
  const [activeNav, setActiveNav] = useState('studio'); // 'studio' | 'presets' | 'games' | 'overlay'
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

  // Theme & Accent States
  const [theme, setTheme] = useState(() => localStorage.getItem('och_theme') || 'dark');
  const [accent, setAccent] = useState(() => localStorage.getItem('och_accent') || 'emerald');

  // Undo / Redo History Stack
  const historyRef = useRef([DEFAULT_PRESETS[0]]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Show Toast Helper
  const showToast = useCallback((toastData) => {
    setToast(toastData);
    if (toastData.duration !== 0) {
      setTimeout(() => {
        setToast((current) => (current === toastData ? null : current));
      }, toastData.duration || 3000);
    }
  }, []);

  // Update Theme & Accent on root DOM
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    localStorage.setItem('och_accent', accent);

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('och_theme', theme);
  }, [theme, accent]);

  // System theme change listener
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Initialize data from Electron store
  useEffect(() => {
    if (window.api) {
      window.api.getStore().then((storeData) => {
        if (storeData) {
          if (storeData.activeCrosshair) {
            setCrosshairConfig(storeData.activeCrosshair);
            historyRef.current = [storeData.activeCrosshair];
            historyIndexRef.current = 0;
          }
          if (storeData.savedCrosshairs) {
            setSavedCrosshairs(storeData.savedCrosshairs);
          }
          if (storeData.gameProfiles) {
            setGameProfiles(storeData.gameProfiles);
          }
          if (storeData.settings) {
            setOverlayEnabled(storeData.settings.overlayEnabled !== false);
            setSelectedDisplayId(storeData.settings.selectedDisplayId);
            if (storeData.settings.theme) setTheme(storeData.settings.theme);
            if (storeData.settings.accent) setAccent(storeData.settings.accent);
          }
        }
      });

      // Get displays
      window.api.getDisplays().then((dispList) => {
        if (dispList) setDisplays(dispList);
      });

      // Listen for game profile switch
      window.api.onGameSwitched(({ profile, crosshair }) => {
        setActiveFocusedProfile(profile);
        if (crosshair) {
          setCrosshairConfig(crosshair);
          showToast({ message: `Auto-switched profile for ${profile.gameName || profile.processName}`, type: 'success' });
        }
      });

      // Listen for overlay toggle
      window.api.onOverlayStateChanged((newState) => {
        setOverlayEnabled(newState);
      });

      // Listen for crosshair recenter
      window.api.onCrosshairRecentered((newCrosshair) => {
        setCrosshairConfig(newCrosshair);
        showToast({ message: 'Crosshair centered to pixel (0, 0)', type: 'info' });
      });

      // Get streamer server info & dynamic port updates
      window.api.getStreamerInfo?.().then((info) => {
        if (info) setStreamerInfo(info);
      });

      window.api.onStreamerPortBound?.((info) => {
        if (info) setStreamerInfo(info);
      });
    }
  }, [showToast]);

  // Push to history helper
  const pushToHistory = useCallback((newConfig) => {
    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(newConfig);
    // Keep max 50 history steps
    if (history.length > 50) history.shift();
    historyRef.current = history;
    historyIndexRef.current = history.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // Sync active crosshair to overlay and streamer server whenever it changes
  const handleConfigChange = (newConfig, recordHistory = true) => {
    setCrosshairConfig(newConfig);

    if (recordHistory) {
      pushToHistory(newConfig);
    }

    if (window.api) {
      const svg = generateCrosshairSVG(newConfig, { viewBoxSize: 128 });
      window.api.updateCrosshair({
        ...newConfig,
        svg: svg,
      });
    }
  };

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevConfig = historyRef.current[historyIndexRef.current];
      setCrosshairConfig(prevConfig);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);

      if (window.api) {
        const svg = generateCrosshairSVG(prevConfig, { viewBoxSize: 128 });
        window.api.updateCrosshair({ ...prevConfig, svg });
      }
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextConfig = historyRef.current[historyIndexRef.current];
      setCrosshairConfig(nextConfig);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);

      if (window.api) {
        const svg = generateCrosshairSVG(nextConfig, { viewBoxSize: 128 });
        window.api.updateCrosshair({ ...nextConfig, svg });
      }
    }
  }, []);

  // Keyboard shortcut handler (Undo, Redo, Recoil, Overlay toggle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleToggleOverlay = () => {
    if (window.api) {
      window.api.toggleOverlay().then((newState) => {
        setOverlayEnabled(newState);
        showToast({ message: `Screen overlay ${newState ? 'activated' : 'muted'}`, type: newState ? 'success' : 'info' });
      });
    } else {
      const next = !overlayEnabled;
      setOverlayEnabled(next);
      showToast({ message: `Screen overlay ${next ? 'activated' : 'muted'}`, type: next ? 'success' : 'info' });
    }
  };

  const handleSelectDisplay = (displayId) => {
    setSelectedDisplayId(displayId);
    if (window.api) {
      window.api.selectDisplay(displayId);
      showToast({ message: `Overlay mapped to Display ${displayId}`, type: 'success' });
    }
  };

  const handleSaveCurrent = (crosshair) => {
    if (window.api) {
      window.api.saveCrosshair(crosshair).then((updatedList) => {
        setSavedCrosshairs(updatedList);
      });
    } else {
      setSavedCrosshairs([crosshair, ...savedCrosshairs]);
    }
  };

  const handleDeleteSaved = (id) => {
    if (window.api) {
      window.api.deleteCrosshair(id).then((updatedList) => {
        setSavedCrosshairs(updatedList);
      });
    } else {
      setSavedCrosshairs(savedCrosshairs.filter((c) => c.id !== id));
    }
  };

  const handleSaveGameProfiles = (newProfiles) => {
    setGameProfiles(newProfiles);
    if (window.api) {
      window.api.saveGameProfiles(newProfiles);
    }
  };

  const handleResetDefaults = () => {
    handleConfigChange(DEFAULT_PRESETS[0]);
    setSettingsOpen(false);
    showToast({ message: 'Settings reset to factory defaults', type: 'info' });
  };

  const handleRecenter = () => {
    const updated = {
      ...crosshairConfig,
      offsetX: 0,
      offsetY: 0,
    };
    handleConfigChange(updated);
    showToast({ message: 'Crosshair centered to pixel (0, 0)', type: 'success' });
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleChangeStreamerPort = async (newPort) => {
    if (window.api?.setStreamerPort) {
      const res = await window.api.setStreamerPort(newPort);
      if (res) setStreamerInfo(res);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] font-sans antialiased">
      {/* Top Header Titlebar */}
      <Header
        overlayEnabled={overlayEnabled}
        onToggleOverlay={handleToggleOverlay}
        displays={displays}
        selectedDisplayId={selectedDisplayId}
        onSelectDisplay={handleSelectDisplay}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        hasUnsavedChanges={false}
        activeProfileName={activeFocusedProfile?.gameName}
        onOpenDonation={() => setDonationOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Modern Sidebar Rail */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenDonation={() => setDonationOpen(true)}
        />

        {/* Central Workspace Switcher */}
        <main className="flex-1 flex overflow-hidden">
          {activeNav === 'studio' && (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Center Viewport Preview Canvas */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <CrosshairPreview
                  config={crosshairConfig}
                  onTriggerRecoil={(amount) => {
                    if (window.api) window.api.triggerRecoil(amount);
                  }}
                  onRecenter={handleRecenter}
                />
              </div>

              {/* Right Customization Inspector */}
              <div className="w-full md:w-80 lg:w-96 h-full overflow-hidden shrink-0">
                <LayerEditor
                  config={crosshairConfig}
                  onChange={handleConfigChange}
                />
              </div>
            </div>
          )}

          {activeNav === 'presets' && (
            <div className="flex-1 h-full overflow-hidden">
              <Presets
                currentConfig={crosshairConfig}
                onSelectPreset={(preset) => {
                  handleConfigChange(preset);
                  setActiveNav('studio');
                  showToast({ message: `Applied preset "${preset.name}"`, type: 'success' });
                }}
                savedCrosshairs={savedCrosshairs}
                onSaveCurrent={handleSaveCurrent}
                onDeleteSaved={handleDeleteSaved}
                onShowToast={showToast}
              />
            </div>
          )}

          {activeNav === 'games' && (
            <div className="flex-1 h-full overflow-hidden">
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
            <div className="flex-1 h-full overflow-hidden">
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
      </div>

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
        allData={{
          activeCrosshair: crosshairConfig,
          savedCrosshairs,
          gameProfiles,
          theme,
          accent,
        }}
        onImportBackup={(backup) => {
          if (backup.activeCrosshair) handleConfigChange(backup.activeCrosshair);
          if (backup.savedCrosshairs) setSavedCrosshairs(backup.savedCrosshairs);
          if (backup.gameProfiles) setGameProfiles(backup.gameProfiles);
          if (backup.theme) setTheme(backup.theme);
          if (backup.accent) setAccent(backup.accent);
          if (window.api) {
            window.api.saveStore?.(backup);
          }
        }}
        onShowToast={showToast}
        onOpenDonation={() => setDonationOpen(true)}
      />

      {/* Community Donation & Sponsorship Modal */}
      <DonationModal
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
        onShowToast={showToast}
      />

      {/* Non-intrusive Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
