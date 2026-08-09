import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Scissors, 
  Sparkles, 
  Check, 
  Layers, 
  Plus, 
  Play, 
  Film,
  ListPlus
} from 'lucide-react';
import { VideoMetadata, ShortClipConfig, AspectRatio, Resolution, ExportFormat } from '../types';
import { PRESET_DURATIONS, DEFAULT_CAPTION_STYLE } from '../utils/constants';
import { generateAutoSubtitlesAndTags } from '../utils/autoGenerator';
import { ViralShortsPreviewGrid } from './ViralShortsPreviewGrid';

interface AutoShortsGeneratorProps {
  activeVideo: VideoMetadata | null;
  onGenerateClips: (clips: ShortClipConfig[]) => void;
  onGoToQueue: () => void;
}

export const AutoShortsGenerator: React.FC<AutoShortsGeneratorProps> = ({
  activeVideo,
  onGenerateClips,
  onGoToQueue,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // 15, 30, 60, 90, 120
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [format, setFormat] = useState<ExportFormat>('mp4');
  const [enableBlurBackground, setEnableBlurBackground] = useState(true);
  const [enableAutoCaptions, setEnableAutoCaptions] = useState(true);
  const [enableAutoTags, setEnableAutoTags] = useState(true);
  const [clipPrefix, setClipPrefix] = useState('short_');
  const [createdViralClips, setCreatedViralClips] = useState<ShortClipConfig[]>([]);

  if (!activeVideo) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
        <Film className="w-12 h-12 text-purple-400/50 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Active Video Selected</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please import or select a source video first in the Video Importer tab to automatically generate short clips.
        </p>
      </div>
    );
  }

  const duration = activeVideo.duration || 60;
  const estimatedClipCount = Math.max(1, Math.floor(duration / selectedDuration));

  const handleCreateAutoShortsWithCount = (desiredCount?: number) => {
    const count = desiredCount || Math.max(1, Math.floor(duration / selectedDuration));
    const clipDuration = desiredCount ? Math.max(5, Math.floor(duration / desiredCount)) : selectedDuration;
    const generatedList: ShortClipConfig[] = [];

    const hooks = [
      'Mindblowing revelation in first 3 seconds',
      'High energy emotional dialogue peak',
      'Trending story arc & visual transition',
      'Strong call to action & retention hook',
      'Fast-paced visual action highlight',
      'Compelling question & answer moment',
      'Unbelievable transformation highlight',
      'Unexpected plot twist segment',
      'Key expert advice summary',
      'Viral reaction climax'
    ];

    for (let i = 0; i < count; i++) {
      const start = i * clipDuration;
      const end = Math.min(duration, (i + 1) * clipDuration);
      const numStr = String(i + 1).padStart(3, '0');
      const title = `${clipPrefix}${numStr}.${format}`;

      const { captions: generatedCaptions, tags: generatedTags, hashtags: generatedHashtags } = generateAutoSubtitlesAndTags(
        activeVideo.name,
        start,
        end
      );

      const sampleCaptions = enableAutoCaptions ? generatedCaptions : [];
      const sampleTags = enableAutoTags ? generatedTags : [];
      const sampleHashtags = enableAutoTags ? generatedHashtags : [];

      const vScore = Math.min(99, Math.max(78, 98 - i * 2));
      const vRank = i + 1;

      const newClip: ShortClipConfig = {
        id: `clip-${Date.now()}-${i}`,
        title: title,
        sourceVideoId: activeVideo.id,
        startTime: Math.round(start),
        endTime: Math.round(end),
        aspectRatio: aspectRatio,
        resolution: resolution,
        format: format,
        quality: 'high',
        customBitrateMbps: 10,
        speed: 1,
        reverse: false,
        cropX: 50,
        cropY: 50,
        blurBackground: enableBlurBackground,
        backgroundColor: '#0a0a0d',
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        captions: sampleCaptions,
        captionStyle: DEFAULT_CAPTION_STYLE,
        tags: sampleTags,
        hashtags: sampleHashtags,
        watermark: {
          enabled: true,
          type: 'text',
          text: 'reelsnip.com',
          opacity: 0.7,
          position: 'bottom-right',
          scale: 1,
        },
        audio: {
          muteOriginal: false,
          originalVolume: 1,
          backgroundMusicVolume: 0.2,
          voiceOverVolume: 1,
          fadeInDuration: 0.5,
          fadeOutDuration: 0.5,
        },
        viralScore: vScore,
        viralRank: vRank,
        viralHook: hooks[i % hooks.length],
        predictedViews: `${Math.round(200 - i * 15)}K - ${Math.round(600 - i * 30)}K Views`,
        status: 'queued',
        progress: 0,
      };

      generatedList.push(newClip);
    }

    setCreatedViralClips(generatedList);
    onGenerateClips(generatedList);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400 fill-purple-400/20" />
              Auto Shorts Creator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase">
              Gemini 3.6 Flash Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automatically split "{activeVideo.name}" ({Math.floor(duration)}s) into social-ready viral short clips with Social Media Canvas Presets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCreateAutoShortsWithCount(10)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 transition transform hover:-translate-y-0.5 border border-amber-300/30"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            Turn 1 Long Video into 10 Viral Shorts
          </button>
          <button
            onClick={() => handleCreateAutoShortsWithCount()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            <Scissors className="w-4 h-4 text-purple-400" />
            Auto Cut ({estimatedClipCount} Clips)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preset Configuration */}
        <div className="lg:col-span-2 space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          {/* Preset Durations */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Target Clip Duration Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PRESET_DURATIONS.map((preset) => {
                const isSelected = selectedDuration === preset.value;
                return (
                  <button
                    key={preset.value}
                    onClick={() => setSelectedDuration(preset.value)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center space-y-1 ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm">{preset.value}s</span>
                    <span className="text-[10px] opacity-80">{preset.label.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format & Aspect Ratio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Aspect Ratio (Social)
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="9:16">9:16 (Shorts / Reels / TikTok)</option>
                <option value="16:9">16:9 (YouTube Standard)</option>
                <option value="1:1">1:1 (Square Feed)</option>
                <option value="4:5">4:5 (Instagram Feed)</option>
                <option value="3:4">3:4 (Portrait)</option>
              </select>
            </div>

            {/* Resolution */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Resolution Quality
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="1080p">1080p (Full HD - Recommended)</option>
                <option value="4k">4K Ultra HD</option>
                <option value="1440p">1440p Quad HD</option>
                <option value="720p">720p HD</option>
                <option value="480p">480p Mobile</option>
              </select>
            </div>

            {/* Output Format */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Output Container
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="mp4">MP4 (H.264 / AAC)</option>
                <option value="webm">WebM (VP9 / Opus)</option>
                <option value="gif">Animated GIF</option>
              </select>
            </div>
          </div>

          {/* Naming Pattern & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Auto Naming Prefix
              </label>
              <input
                type="text"
                value={clipPrefix}
                onChange={(e) => setClipPrefix(e.target.value)}
                placeholder="short_"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Generates: {clipPrefix}001.{format}, {clipPrefix}002.{format}...
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={enableBlurBackground}
                  onChange={(e) => setEnableBlurBackground(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Blur Background Padding (for 16:9 to 9:16)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={enableAutoCaptions}
                  onChange={(e) => setEnableAutoCaptions(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Auto Generate Subtitles & Karaoke Captions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={enableAutoTags}
                  onChange={(e) => setEnableAutoTags(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Auto Generate Viral Hashtags & SEO Tags</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Clip Batch Preview */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Batch Output Summary
            </h3>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Duration:</span>
                <span className="font-semibold text-white">{Math.floor(duration)} seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Short Duration:</span>
                <span className="font-semibold text-purple-300">{selectedDuration}s each</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Shorts Count:</span>
                <span className="font-bold text-emerald-400">{estimatedClipCount} files</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {Array.from({ length: estimatedClipCount }).map((_, i) => {
                const start = i * selectedDuration;
                const end = Math.min(duration, (i + 1) * selectedDuration);
                const numStr = String(i + 1).padStart(3, '0');
                const name = `${clipPrefix}${numStr}.${format}`;

                return (
                  <div
                    key={i}
                    className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-medium truncate">{name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {Math.floor(start)}s - {Math.floor(end)}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleCreateAutoShortsWithCount()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
          >
            <ListPlus className="w-4 h-4" />
            Queue All {estimatedClipCount} Shorts to Export
          </button>
        </div>
      </div>

      {/* Interactive Viral Shorts Preview Grid with AI Scores */}
      {createdViralClips.length > 0 && (
        <ViralShortsPreviewGrid
          clips={createdViralClips}
          activeVideo={activeVideo}
          onQueueClip={onGoToQueue}
        />
      )}
    </div>
  );
};
