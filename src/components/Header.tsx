import React from 'react';
import { 
  Scissors, 
  ShieldCheck, 
  Download, 
  Moon, 
  Sun, 
  ExternalLink,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenPlatformModal: () => void;
  pwaPrompt: unknown;
  onInstallPwa: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenPlatformModal,
  pwaPrompt,
  onInstallPwa,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scissors className="w-5 h-5 text-purple-400 transform -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <a
                  href="https://reelsnip.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent hover:opacity-90 transition flex items-center gap-1"
                  title="Visit reelsnip.com"
                >
                  Reelsnip AI
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400 inline" />
                </a>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Offline Device Processing
              </p>
            </div>
          </div>

          {/* Mobile Platform Selector Trigger */}
          <button
            onClick={onOpenPlatformModal}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-semibold border border-purple-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Presets
          </button>
        </div>

        {/* Center Quick Navs / Action Badges */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('importer')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'importer' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Import Video
          </button>
          <button
            onClick={() => setActiveTab('auto')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'auto' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Auto Shorts
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'editor' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Edit & Custom
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'queue' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Export & Zip
          </button>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Platform Presets Button */}
          <button
            onClick={onOpenPlatformModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Target Social Platform Preset Selector"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            Platforms
          </button>

          {/* PWA Install Button */}
          {pwaPrompt && (
            <button
              onClick={onInstallPwa}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/10 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() =>
              onUpdateSettings({
                theme: settings.theme === 'dark' ? 'light' : 'dark',
              })
            }
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
