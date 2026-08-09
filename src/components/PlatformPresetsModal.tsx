import React from 'react';
import { X, Youtube, Video, Instagram, Facebook, Camera, Twitter, Check } from 'lucide-react';
import { PLATFORM_PRESETS } from '../utils/constants';

interface PlatformPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatformId: string;
  onSelectPlatform: (platformId: string) => void;
}

export const PlatformPresetsModal: React.FC<PlatformPresetsModalProps> = ({
  isOpen,
  onClose,
  selectedPlatformId,
  onSelectPlatform,
}) => {
  if (!isOpen) return null;

  const getPlatformIcon = (name: string) => {
    if (name.includes('YouTube')) return <Youtube className="w-5 h-5 text-red-500" />;
    if (name.includes('TikTok')) return <Video className="w-5 h-5 text-cyan-400" />;
    if (name.includes('Instagram')) return <Instagram className="w-5 h-5 text-pink-500" />;
    if (name.includes('Facebook')) return <Facebook className="w-5 h-5 text-blue-500" />;
    if (name.includes('Snapchat')) return <Camera className="w-5 h-5 text-yellow-400" />;
    return <Twitter className="w-5 h-5 text-sky-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white">Target Social Platform Presets</h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose a target platform to apply optimal aspect ratio, resolution, and bitrate presets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLATFORM_PRESETS.map((p) => {
            const isSelected = selectedPlatformId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPlatform(p.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition text-left flex items-start justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {getPlatformIcon(p.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{p.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {p.aspectRatio} | {p.width}x{p.height}
                    </span>
                    <span className="text-[10px] text-purple-300 block">
                      Max {p.maxDurationSec}s | {p.recommendedBitrateMbps} Mbps
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
