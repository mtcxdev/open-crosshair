import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CrosshairPreview } from './components/CrosshairPreview';
import { LayerEditor } from './components/LayerEditor';
import { Presets } from './components/Presets';
import { GameProfiles } from './components/GameProfiles';
import { StreamerHub } from './components/StreamerHub';
import { SettingsModal } from './components/SettingsModal';
import { DEFAULT_PRESETS } from './constants/defaultPresets';
import { generateCrosshairSVG } from './utils/svgGenerator';
import {
  Crosshair,
  Bookmark,
  Gamepad2,
  Video,
  Settings as SettingsIcon,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function App() {
  const [activeNav, setActiveNav] = useState('studio'); // 'studio' | 'presets' | 'profiles' | 'streamer'
  const [crosshairConfig, setCrosshairConfig] = useState(DEFAULT_PRESETS[0]);
  const [savedCrosshairs, setSavedCrosshairs] = useState([]);
  const [gameProfiles, setGameProfiles] = useState([]);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [displays, setDisplays] = useState([]);
  const [selectedDisplayId, setSelectedDisplayId] = useState(null);
  const [activeFocusedProfile, setActiveFocusedProfile] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Initialize data from Electron store
  useEffect(() => {
    if (window.api) {
      window.api.getStore().then((storeData) => {
        if (storeData) {
          if (storeData.activeCrosshair) {
            setCrosshairConfig(storeData.activeCrosshair);
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
        setCrosshairConfig(crosshair);
      });

      // Listen for overlay toggle
      window.api.onOverlayStateChanged((newState) => {
        setOverlayEnabled(newState);
      });
    }
  }, []);

  // Sync active crosshair to overlay and streamer server whenever it changes
  const handleConfigChange = (newConfig) => {
    setCrosshairConfig(newConfig);

    if (window.api) {
      const svg = generateCrosshairSVG(newConfig, { viewBoxSize: 128 });
      window.api.updateCrosshair({
        ...newConfig,
        svg: svg,
      });
    }
  };

  const handleToggleOverlay = () => {
    if (window.api) {
      window.api.toggleOverlay().then((newState) => {
        setOverlayEnabled(newState);
      });
    } else {
      setOverlayEnabled(!overlayEnabled);
    }
  };

  const handleSelectDisplay = (displayId) => {
    setSelectedDisplayId(displayId);
    if (window.api) {
      window.api.selectDisplay(displayId);
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
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0B0E] text-[#F3F4F6] font-sans">
      {/* Top Header */}
      <Header
        overlayEnabled={overlayEnabled}
        onToggleOverlay={handleToggleOverlay}
        displays={displays}
        selectedDisplayId={selectedDisplayId}
        onSelectDisplay={handleSelectDisplay}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Vertical Navigation Rail */}
        <aside className="w-16 bg-[#0E1017] border-r-2 border-[#262A3B] flex flex-col items-center justify-between py-3 select-none z-20">
          <div className="flex flex-col gap-2 w-full px-2">
            <button
              onClick={() => setActiveNav('studio')}
              className={`w-full h-11 flex flex-col items-center justify-center border transition-all ${
                activeNav === 'studio'
                  ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B] hover:text-white hover:border-[#8E95A5]'
              }`}
              title="Crosshair Studio"
            >
              <Crosshair size={18} className="stroke-[2.5]" />
              <span className="text-[9px] font-mono font-bold mt-0.5">STUDIO</span>
            </button>

            <button
              onClick={() => setActiveNav('presets')}
              className={`w-full h-11 flex flex-col items-center justify-center border transition-all ${
                activeNav === 'presets'
                  ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B] hover:text-white hover:border-[#8E95A5]'
              }`}
              title="Preset Vault"
            >
              <Bookmark size={17} />
              <span className="text-[9px] font-mono font-bold mt-0.5">VAULT</span>
            </button>

            <button
              onClick={() => setActiveNav('profiles')}
              className={`w-full h-11 flex flex-col items-center justify-center border transition-all ${
                activeNav === 'profiles'
                  ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B] hover:text-white hover:border-[#8E95A5]'
              }`}
              title="Game Profiles"
            >
              <Gamepad2 size={18} />
              <span className="text-[9px] font-mono font-bold mt-0.5">GAMES</span>
            </button>

            <button
              onClick={() => setActiveNav('streamer')}
              className={`w-full h-11 flex flex-col items-center justify-center border transition-all ${
                activeNav === 'streamer'
                  ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#181B26] text-[#8E95A5] border-[#262A3B] hover:text-white hover:border-[#8E95A5]'
              }`}
              title="OBS Streamer Source"
            >
              <Video size={17} />
              <span className="text-[9px] font-mono font-bold mt-0.5">OBS</span>
            </button>
          </div>

          {/* Bottom Settings Button */}
          <div className="w-full px-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full h-10 flex flex-col items-center justify-center border border-[#262A3B] bg-[#181B26] text-[#8E95A5] hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
              title="Settings"
            >
              <SettingsIcon size={16} />
              <span className="text-[9px] font-mono font-bold mt-0.5">CONFIG</span>
            </button>
          </div>
        </aside>

        {/* Central Workspace Switcher */}
        <main className="flex-1 flex overflow-hidden">
          {activeNav === 'studio' && (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Center Viewport Preview */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <CrosshairPreview
                  config={crosshairConfig}
                  onTriggerRecoil={(amount) => {
                    if (window.api) window.api.triggerRecoil(amount);
                  }}
                />
              </div>

              {/* Right Layer Editor Panel */}
              <div className="w-full md:w-80 lg:w-96 h-full overflow-hidden">
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
                onSelectPreset={handleConfigChange}
                savedCrosshairs={savedCrosshairs}
                onSaveCurrent={handleSaveCurrent}
                onDeleteSaved={handleDeleteSaved}
              />
            </div>
          )}

          {activeNav === 'profiles' && (
            <div className="flex-1 h-full overflow-hidden">
              <GameProfiles
                profiles={gameProfiles}
                onSaveProfiles={handleSaveGameProfiles}
                savedCrosshairs={savedCrosshairs}
                activeProfile={activeFocusedProfile}
              />
            </div>
          )}

          {activeNav === 'streamer' && (
            <div className="flex-1 h-full overflow-hidden">
              <StreamerHub />
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
      />
    </div>
  );
}
