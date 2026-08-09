export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '3:4' | 'original';

export type Resolution = '4k' | '1440p' | '1080p' | '720p' | '480p' | '360p' | '240p';

export type ExportFormat = 'mp4' | 'webm' | 'gif' | 'mov';

export type QualityPreset = 'ultra' | 'high' | 'medium' | 'low' | 'custom';

export interface VideoMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
  bitrate?: number;
  codec?: string;
  thumbnailUrl: string;
  file?: File;
  addedAt: number;
}

export interface HighlightSegment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  score: number; // 0 to 100
  reason: 'scene_change' | 'high_motion' | 'audio_peak' | 'speech' | 'ai_detected';
  label: string;
}

export interface CaptionStyle {
  fontFamily: string;
  fontSize: number; // px
  textColor: string;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  positionY: number; // percentage 0 - 100
  animation: 'none' | 'bounce' | 'pop' | 'fade' | 'karaoke';
  highlightColor: string;
  uppercase: boolean;
}

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionLine {
  id: string;
  start: number;
  end: number;
  text: string;
  words?: CaptionWord[];
}

export interface WatermarkSettings {
  enabled: boolean;
  type: 'text' | 'image';
  text: string;
  imageUrl?: string;
  opacity: number; // 0.1 - 1
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  scale: number;
}

export interface AudioSettings {
  muteOriginal: boolean;
  originalVolume: number; // 0 - 2
  backgroundMusicUrl?: string;
  backgroundMusicVolume: number; // 0 - 1
  voiceOverUrl?: string;
  voiceOverVolume: number; // 0 - 2
  fadeInDuration: number; // seconds
  fadeOutDuration: number; // seconds
}

export interface ShortClipConfig {
  id: string;
  title: string;
  sourceVideoId: string;
  startTime: number;
  endTime: number;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  format: ExportFormat;
  quality: QualityPreset;
  customBitrateMbps: number;
  speed: number;
  reverse: boolean;
  cropX: number; // 0 - 100 offset
  cropY: number;
  blurBackground: boolean;
  backgroundColor: string;
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  captions: CaptionLine[];
  captionStyle: CaptionStyle;
  watermark: WatermarkSettings;
  audio: AudioSettings;
  viralScore?: number;
  viralRank?: number;
  viralTitle?: string;
  viralHook?: string;
  predictedViews?: string;
  tags?: string[];
  hashtags?: string[];
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  resultBlob?: Blob;
  resultSize?: number;
  error?: string;
}

export interface ProcessingTask {
  id: string;
  clipId: string;
  clipTitle: string;
  sourceName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0 - 100
  currentTask: string;
  startTime?: number;
  endTime?: number;
  estimatedRemainingSec?: number;
  error?: string;
}

export interface ConsoleLogMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface PlatformPreset {
  id: string;
  name: string;
  iconName: string;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  maxDurationSec: number;
  recommendedBitrateMbps: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  defaultQuality: QualityPreset;
  preferredPlatform: string;
  autoProcessOnImport: boolean;
  enableHardwareAcceleration: boolean;
  maxConcurrentWorker: number;
  watermarkDefaultText: string;
  geminiApiKey?: string;
}
