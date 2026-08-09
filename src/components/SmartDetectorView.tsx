import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Volume2, 
  Eye, 
  Flame, 
  Plus, 
  Play, 
  CheckCircle,
  Video
} from 'lucide-react';
import { VideoMetadata, HighlightSegment, ShortClipConfig } from '../types';
import { detectVideoHighlights } from '../utils/smartDetector';
import { DEFAULT_CAPTION_STYLE } from '../utils/constants';
import { generateAutoSubtitlesAndTags } from '../utils/autoGenerator';

interface SmartDetectorViewProps {
  activeVideo: VideoMetadata | null;
  onAddShortClip: (clip: ShortClipConfig) => void;
  onGoToQueue: () => void;
}

export const SmartDetectorView: React.FC<SmartDetectorViewProps> = ({
  activeVideo,
  onAddShortClip,
  onGoToQueue,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [targetLength, setTargetLength] = useState(30);
  const [highlights, setHighlights] = useState<HighlightSegment[]>([]);

  if (!activeVideo) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
        <Sparkles className="w-12 h-12 text-purple-400/50 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Active Video Selected</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please select a source video first to run local smart scene & peak detector.
        </p>
      </div>
    );
  }

  const handleRunSmartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStage('Initializing local scanner...');

    const tempVideo = document.createElement('video');
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.src = activeVideo.url;

    tempVideo.onloadedmetadata = async () => {
      try {
        const results = await detectVideoHighlights(tempVideo, {
          targetDuration: targetLength,
          onProgress: (pct, stage) => {
            setScanProgress(pct);
            setScanStage(stage);
          },
        });
        setHighlights(results);
      } catch (err) {
        console.error('Smart detection error', err);
      } finally {
        setIsScanning(false);
      }
    };
  };

  const handleCreateClipFromHighlight = (hl: HighlightSegment) => {
    const title = `smart_${hl.reason}_${Math.floor(hl.startTime)}s.mp4`;
    const { captions, tags, hashtags } = generateAutoSubtitlesAndTags(
      activeVideo.name,
      hl.startTime,
      hl.endTime
    );

    const newClip: ShortClipConfig = {
      id: `smart-${Date.now()}`,
      title: title,
      sourceVideoId: activeVideo.id,
      startTime: hl.startTime,
      endTime: hl.endTime,
      aspectRatio: '9:16',
      resolution: '1080p',
      format: 'mp4',
      quality: 'high',
      customBitrateMbps: 10,
      speed: 1,
      reverse: false,
      cropX: 50,
      cropY: 50,
      blurBackground: true,
      backgroundColor: '#0a0a0d',
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      captions,
      captionStyle: DEFAULT_CAPTION_STYLE,
      tags,
      hashtags,
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
      status: 'queued',
      progress: 0,
    };

    onAddShortClip(newClip);
    onGoToQueue();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Smart AI Detection Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase">
              Gemini 3.6 Flash Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Browser-based Gemini AI detector analyzes audio energy peaks, motion changes, and scene shifts locally for Social Media Canvas Presets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={targetLength}
            onChange={(e) => setTargetLength(Number(e.target.value))}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value={15}>Target 15s Shorts</option>
            <option value={30}>Target 30s Shorts</option>
            <option value={60}>Target 60s Shorts</option>
          </select>

          <button
            onClick={handleRunSmartScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition"
          >
            <Activity className="w-4 h-4" />
            {isScanning ? 'Scanning...' : 'Run Smart Detection'}
          </button>
        </div>
      </div>

      {/* Progress Bar when scanning */}
      {isScanning && (
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-purple-500/30 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              {scanStage}
            </span>
            <span className="text-purple-300 font-mono">{scanProgress}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-purple-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Detected Highlights Grid */}
      {highlights.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Detected Viral Key Moments ({highlights.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((hl) => (
              <div
                key={hl.id}
                className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      Score {hl.score}/100
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {hl.startTime}s - {hl.endTime}s ({hl.duration}s)
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-slate-200 mt-2">{hl.label}</h4>

                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    {hl.reason === 'audio_peak' && <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
                    {hl.reason === 'scene_change' && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                    {hl.reason === 'high_motion' && <Activity className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className="capitalize">{hl.reason.replace('_', ' ')} Detected</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCreateClipFromHighlight(hl)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Short Clip
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isScanning && (
          <div className="p-8 text-center bg-slate-900/20 rounded-2xl border border-slate-800 space-y-2">
            <Video className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              Click "Run Smart Detection" above to automatically scan for scene shifts and high energy moments in "{activeVideo.name}".
            </p>
          </div>
        )
      )}
    </div>
  );
};
