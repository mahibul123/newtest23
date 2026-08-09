import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Crop as CropIcon, 
  RotateCw, 
  FlipHorizontal, 
  Sliders, 
  Maximize2, 
  Eye, 
  Volume2, 
  VolumeX, 
  Scissors, 
  Sparkles,
  Download,
  Plus
} from 'lucide-react';
import { VideoMetadata, ShortClipConfig, AspectRatio, Resolution, ExportFormat, QualityPreset } from '../types';
import { drawVideoFrameToCanvas, getDimensions } from '../utils/videoProcessor';
import { DEFAULT_CAPTION_STYLE } from '../utils/constants';
import { generateAutoSubtitlesAndTags } from '../utils/autoGenerator';

interface VideoEditorCanvasProps {
  activeVideo: VideoMetadata | null;
  onSaveClip: (clip: ShortClipConfig) => void;
  onGoToQueue: () => void;
}

export const VideoEditorCanvas: React.FC<VideoEditorCanvasProps> = ({
  activeVideo,
  onSaveClip,
  onGoToQueue,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Clip Settings State
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [format, setFormat] = useState<ExportFormat>('mp4');
  const [quality, setQuality] = useState<QualityPreset>('high');
  const [customBitrate, setCustomBitrate] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [blurBackground, setBlurBackground] = useState(true);
  const [clipTitle, setClipTitle] = useState('custom_short.mp4');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize bounds on video load
  useEffect(() => {
    if (activeVideo) {
      setEndTime(Math.min(30, activeVideo.duration || 30));
      setClipTitle(`${activeVideo.name.replace(/\.[^/.]+$/, '')}_short.mp4`);
    }
  }, [activeVideo]);

  // Canvas Render Loop
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !activeVideo) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (video.readyState >= 2) {
        const { width, height } = getDimensions(aspectRatio, resolution);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        const dummyClipConfig: ShortClipConfig = {
          id: 'preview',
          title: clipTitle,
          sourceVideoId: activeVideo.id,
          startTime,
          endTime,
          aspectRatio,
          resolution,
          format,
          quality,
          customBitrateMbps: customBitrate,
          speed,
          reverse: false,
          cropX,
          cropY,
          blurBackground,
          backgroundColor: '#0a0a0d',
          rotation,
          flipHorizontal,
          flipVertical,
          captions: [],
          captionStyle: DEFAULT_CAPTION_STYLE,
          watermark: { enabled: true, type: 'text', text: 'reelsnip.com', opacity: 0.7, position: 'bottom-right', scale: 1 },
          audio: { muteOriginal: false, originalVolume: 1, backgroundMusicVolume: 0.2, voiceOverVolume: 1, fadeInDuration: 0.5, fadeOutDuration: 0.5 },
          status: 'idle',
          progress: 0,
        };

        drawVideoFrameToCanvas(ctx, video, width, height, video.currentTime, dummyClipConfig);
        setCurrentTime(video.currentTime);
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeVideo, aspectRatio, resolution, cropX, cropY, rotation, flipHorizontal, flipVertical, blurBackground]);

  if (!activeVideo) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
        <CropIcon className="w-12 h-12 text-purple-400/50 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Active Video Selected</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please select a source video first to edit aspect ratios, crop, trim, and preview.
        </p>
      </div>
    );
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.playbackRate = speed;
      video.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleAddToQueue = () => {
    const { captions, tags, hashtags } = generateAutoSubtitlesAndTags(
      clipTitle || activeVideo.name,
      startTime,
      endTime
    );

    const newClip: ShortClipConfig = {
      id: `custom-${Date.now()}`,
      title: clipTitle,
      sourceVideoId: activeVideo.id,
      startTime,
      endTime,
      aspectRatio,
      resolution,
      format,
      quality,
      customBitrateMbps: customBitrate,
      speed,
      reverse: false,
      cropX,
      cropY,
      blurBackground,
      backgroundColor: '#0a0a0d',
      rotation,
      flipHorizontal,
      flipVertical,
      captions,
      captionStyle: DEFAULT_CAPTION_STYLE,
      tags,
      hashtags,
      watermark: { enabled: true, type: 'text', text: 'reelsnip.com', opacity: 0.7, position: 'bottom-right', scale: 1 },
      audio: { muteOriginal: false, originalVolume: 1, backgroundMusicVolume: 0.2, voiceOverVolume: 1, fadeInDuration: 0.5, fadeOutDuration: 0.5 },
      status: 'queued',
      progress: 0,
    };

    onSaveClip(newClip);
    onGoToQueue();
  };

  return (
    <div className="space-y-6">
      {/* Hidden Source Video Element */}
      <video
        ref={videoRef}
        src={activeVideo.url}
        crossOrigin="anonymous"
        className="hidden"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CropIcon className="w-6 h-6 text-purple-400" />
            Live Canvas Video Editor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Precision trim, crop pan-scan, aspect ratio scaling, rotation, speed, and preview.
          </p>
        </div>

        <button
          onClick={handleAddToQueue}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Edited Clip to Export Queue
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Canvas Live Preview Stage */}
        <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-between space-y-4">
          <div className="relative w-full max-w-xs sm:max-w-sm aspect-[9/16] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          {/* Player Transport Controls */}
          <div className="w-full space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>{currentTime.toFixed(1)}s</span>
              <span>Trim Window: {startTime}s - {endTime}s ({(endTime - startTime).toFixed(1)}s)</span>
              <span>{activeVideo.duration.toFixed(1)}s</span>
            </div>

            <input
              type="range"
              min={0}
              max={activeVideo.duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-purple-500 cursor-pointer"
            />

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={togglePlay}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Transform & Quality Settings
          </h3>

          {/* Clip Title */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Short Title / Filename
            </label>
            <input
              type="text"
              value={clipTitle}
              onChange={(e) => setClipTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Trim Range Sliders */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Trim Start & End Time</span>
              <span className="text-purple-400 font-mono">{startTime}s - {endTime}s</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block">Start (Sec)</span>
                <input
                  type="number"
                  min={0}
                  max={endTime - 1}
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">End (Sec)</span>
                <input
                  type="number"
                  min={startTime + 1}
                  max={activeVideo.duration}
                  value={endTime}
                  onChange={(e) => setEndTime(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Aspect Ratio & Resolution */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              >
                <option value="9:16">9:16 Vertical Shorts</option>
                <option value="16:9">16:9 Landscape</option>
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 Feed</option>
                <option value="3:4">3:4 Tall</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="4k">4K Ultra HD</option>
                <option value="720p">720p HD</option>
                <option value="480p">480p Mobile</option>
              </select>
            </div>
          </div>

          {/* Crop Center Offset */}
          <div className="space-y-1 pt-3 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Pan & Crop Center (X Offset)</span>
              <span className="text-slate-400 font-mono">{cropX}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={cropX}
              onChange={(e) => setCropX(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Rotation & Flips & Speed */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <RotateCw className="w-3.5 h-3.5 text-purple-400" />
              Rotate ({rotation}°)
            </button>

            <button
              onClick={() => setFlipHorizontal(!flipHorizontal)}
              className={`py-2 border text-xs rounded-lg flex items-center justify-center gap-1.5 transition ${
                flipHorizontal ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              Flip Horiz
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={blurBackground}
                onChange={(e) => setBlurBackground(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
              />
              <span>Enable Blurred Background Padding</span>
            </label>
          </div>

          <button
            onClick={handleAddToQueue}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Edited Clip to Export Queue
          </button>
        </div>
      </div>
    </div>
  );
};
