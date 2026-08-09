import React from 'react';
import { 
  Upload, 
  Zap, 
  Sparkles, 
  Crop, 
  MessageSquare, 
  Music, 
  PackageCheck, 
  Terminal, 
  SlidersHorizontal,
  TrendingUp,
  Film
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  videoCount: number;
  clipCount: number;
  queueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  videoCount,
  clipCount,
  queueCount,
}) => {
  const navItems = [
    {
      id: 'importer',
      label: 'Video Importer',
      icon: Upload,
      badge: videoCount > 0 ? `${videoCount} source` : undefined,
    },
    {
      id: 'auto',
      label: 'Auto Shorts Creator',
      icon: Zap,
      badge: 'Auto 15s/30s/60s',
      highlight: true,
    },
    {
      id: 'tools',
      label: 'Video Tools Suite',
      icon: SlidersHorizontal,
      badge: 'Cutter • Resizer',
    },
    {
      id: 'seo',
      label: 'AI SEO & Viral Metadata',
      icon: TrendingUp,
      badge: 'SEO Score 96+',
      color: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'smart',
      label: 'Smart AI Detection',
      icon: Sparkles,
      badge: 'Local AI',
    },
    {
      id: 'editor',
      label: 'Video & Canvas Editor',
      icon: Crop,
    },
    {
      id: 'captions',
      label: 'Captions & Subtitles',
      icon: MessageSquare,
      badge: 'Karaoke',
    },
    {
      id: 'audio',
      label: 'Audio & Voiceover',
      icon: Music,
    },
    {
      id: 'queue',
      label: 'Export Queue & Zip',
      icon: PackageCheck,
      badge: clipCount > 0 ? `${clipCount} clips` : undefined,
      color: queueCount > 0 ? 'bg-amber-500/20 text-amber-300' : undefined,
    },
    {
      id: 'logs',
      label: 'Console & Settings',
      icon: Terminal,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-3 flex flex-col justify-between space-y-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
          <span>Navigation Dashboard</span>
          <Film className="w-3.5 h-3.5 text-purple-400" />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600/90 text-white shadow-lg shadow-purple-600/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      item.color ||
                      (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Browser Processing:</span>
          <span className="text-emerald-400 font-bold">100% Local</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Engine:</span>
          <span className="text-purple-300">Canvas & WebCodecs</span>
        </div>
        <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-500 text-center">
          Powered by <a href="https://reelsnip.com" target="_blank" rel="noreferrer" className="text-purple-400 underline hover:text-purple-300">Reelsnip AI</a>
        </div>
      </div>
    </aside>
  );
};
