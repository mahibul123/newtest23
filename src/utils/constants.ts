import { PlatformPreset, CaptionStyle } from '../types';

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    iconName: 'Youtube',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDurationSec: 60,
    recommendedBitrateMbps: 12,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    iconName: 'Video',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDurationSec: 600,
    recommendedBitrateMbps: 10,
  },
  {
    id: 'instagram_reels',
    name: 'Instagram Reels',
    iconName: 'Instagram',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDurationSec: 90,
    recommendedBitrateMbps: 10,
  },
  {
    id: 'facebook_reels',
    name: 'Facebook Reels',
    iconName: 'Facebook',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDurationSec: 90,
    recommendedBitrateMbps: 8,
  },
  {
    id: 'snapchat',
    name: 'Snapchat Spotlight',
    iconName: 'Camera',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDurationSec: 60,
    recommendedBitrateMbps: 8,
  },
  {
    id: 'x_twitter',
    name: 'X (Twitter)',
    iconName: 'Twitter',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    maxDurationSec: 140,
    recommendedBitrateMbps: 8,
  },
];

export const PRESET_DURATIONS = [
  { label: '15 Seconds', value: 15 },
  { label: '30 Seconds', value: 30 },
  { label: '60 Seconds', value: 60 },
  { label: '90 Seconds', value: 90 },
  { label: '120 Seconds', value: 120 },
];

export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  fontFamily: 'Bebas Neue, sans-serif',
  fontSize: 32,
  textColor: '#FFFFFF',
  backgroundColor: 'rgba(0,0,0,0.6)',
  strokeColor: '#000000',
  strokeWidth: 4,
  shadowColor: 'rgba(0,0,0,0.8)',
  shadowBlur: 8,
  positionY: 80,
  animation: 'karaoke',
  highlightColor: '#FACC15', // Gold / Yellow
  uppercase: true,
};

export const SAMPLE_VIDEOS = [
  {
    name: 'Big Buck Bunny Sample.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'High-res sample animation video for testing shorts generator',
  },
  {
    name: 'For Bigger Blazes.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Fast motion action sample video',
  },
  {
    name: 'Elephants Dream.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Cinematic 3D animation test file',
  },
];
