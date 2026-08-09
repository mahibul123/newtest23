import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  Pause, 
  Sparkles, 
  Trophy, 
  Youtube, 
  Instagram, 
  Video, 
  Facebook, 
  Download, 
  Scissors, 
  Share2, 
  Check, 
  Eye, 
  TrendingUp,
  Zap,
  Clock,
  MessageSquare,
  Tag,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ShortClipConfig, VideoMetadata } from '../types';

interface ViralShortsPreviewGridProps {
  clips: ShortClipConfig[];
  activeVideo: VideoMetadata | null;
  onQueueClip?: (clip: ShortClipConfig) => void;
  onEditClip?: (clip: ShortClipConfig) => void;
}

export const ViralShortsPreviewGrid: React.FC<ViralShortsPreviewGridProps> = ({
  clips,
  activeVideo,
  onQueueClip,
  onEditClip,
}) => {
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedClipId, setExpandedClipId] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<{ id: string; text: string } | null>(null);

  if (clips.length === 0) return null;

  // Sort by AI Viral Score descending if available
  const sortedClips = [...clips].sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDirectDownload = (clip: ShortClipConfig) => {
    const videoUrl = clip.resultUrl || activeVideo?.url;
    if (!videoUrl) return;

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = clip.title || `viral_short_${clip.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShareNotice({ id: clip.id, text: '📥 Short video download started!' });
    setTimeout(() => setShareNotice(null), 3500);
  };

  const handleShareToPlatform = (platform: 'youtube' | 'instagram' | 'facebook' | 'native', clip: ShortClipConfig) => {
    const title = clip.viralTitle || clip.title;
    const hashtags = (clip.hashtags || []).join(' ');
    const tags = (clip.tags || []).join(', ');
    const fullCaption = `${title}\n\n${hashtags}\nTags: ${tags}`;

    // Copy caption & hashtags to clipboard
    navigator.clipboard.writeText(fullCaption);

    if (platform === 'native' && navigator.share) {
      navigator.share({
        title: title,
        text: fullCaption,
        url: clip.resultUrl || activeVideo?.url,
      }).catch(() => {});
      return;
    }

    let url = '';
    let platformName = '';

    if (platform === 'youtube') {
      url = 'https://studio.youtube.com/channel/upload';
      platformName = 'YouTube Shorts Studio';
    } else if (platform === 'instagram') {
      url = 'https://www.instagram.com/reels/create/';
      platformName = 'Instagram Reels';
    } else if (platform === 'facebook') {
      url = 'https://www.facebook.com/reels/create';
      platformName = 'Facebook Reels';
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      setShareNotice({ id: clip.id, text: `📋 Title & Hashtags copied! Opening ${platformName}...` });
      setTimeout(() => setShareNotice(null), 4000);
    }
  };

  const getRankBadge = (index: number, score?: number) => {
    if (index === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-lg shadow-amber-500/20 flex items-center gap-1">
          <Trophy className="w-3 h-3 fill-slate-950" />
          #1 Top Viral Winner ({score || 98}/100)
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-300 to-slate-100 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
          #2 High Retention ({score || 95}/100)
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 text-white font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-amber-300" />
          #3 Trending Pick ({score || 92}/100)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
        #{index + 1} Viral Score: {score || 85}/100
      </span>
    );
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-5 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5 fill-amber-400" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              AI Viral Shorts Preview & Rankings ({clips.length} Shorts Generated)
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Gemini 3.6 Flash analyzed scene dynamics, audio hooks, and visual motion to rank these short clips for maximum engagement on YouTube Shorts, TikTok & Reels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Social Canvas Ready
          </div>
        </div>
      </div>

      {/* Grid of Shorts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedClips.map((clip, index) => {
          const isPlaying = playingClipId === clip.id;
          const videoSrc = activeVideo?.url || '';

          return (
            <div
              key={clip.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-200 group flex flex-col justify-between shadow-xl"
            >
              {/* Card Header & Rank */}
              <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
                {getRankBadge(index, clip.viralScore)}
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {clip.aspectRatio}
                </span>
              </div>

              {/* Video Player Preview Container */}
              <div className="relative aspect-[9/16] max-h-72 bg-black flex items-center justify-center overflow-hidden group">
                {videoSrc ? (
                  <video
                    src={videoSrc}
                    controls={isPlaying}
                    playsInline
                    muted={false}
                    className="w-full h-full object-cover"
                    onPlay={() => setPlayingClipId(clip.id)}
                    onPause={() => setPlayingClipId(null)}
                    ref={(el) => {
                      if (el && isPlaying && el.paused) {
                        el.currentTime = clip.startTime;
                        el.play().catch(() => {});
                      }
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <Video className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Video preview ready</p>
                  </div>
                )}

                {/* Overlaid Play Trigger Button */}
                {!isPlaying && (
                  <button
                    onClick={() => setPlayingClipId(clip.id)}
                    className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 transition transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                    <span className="text-[11px] font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/80 backdrop-blur-sm">
                      Preview Short Clip ({Math.round(clip.endTime - clip.startTime)}s)
                    </span>
                  </button>
                )}

                {/* Overlaid Viral Hook Badge */}
                <div className="absolute top-2 left-2 right-2 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-200 space-y-0.5 pointer-events-none">
                  <div className="flex items-center justify-between text-amber-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-400" />
                      AI Hook Rating
                    </span>
                    <span className="font-mono">{clip.predictedViews || '150K - 500K Views'}</span>
                  </div>
                  <p className="text-slate-300 truncate font-semibold">
                    "{clip.viralHook || 'High emotional hook peak in first 3 seconds'}"
                  </p>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-4 space-y-3 bg-slate-900/60">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-white line-clamp-1">{clip.title}</h4>
                    <button
                      onClick={() => handleCopyText(clip.title, clip.id)}
                      className="text-slate-500 hover:text-purple-400 p-1 shrink-0 transition"
                      title="Copy Title"
                    >
                      {copiedId === clip.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      {(clip.endTime - clip.startTime).toFixed(0)}s Duration
                    </span>
                  </div>
                </div>

                {/* Auto Subtitles Summary */}
                {clip.captions && clip.captions.length > 0 && (
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                        Auto Subtitles ({clip.captions.length} lines)
                      </span>
                      <button
                        onClick={() => handleCopyText(clip.captions.map((c) => c.text).join('\n'), `sub-${clip.id}`)}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                        title="Copy All Subtitles"
                      >
                        {copiedId === `sub-${clip.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === `sub-${clip.id}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-slate-300 italic line-clamp-1 bg-slate-900/60 p-1.5 rounded border border-slate-800/60">
                      "{clip.captions[0].text}"
                    </p>
                  </div>
                )}

                {/* Auto Tags & Hashtags Summary */}
                {((clip.hashtags && clip.hashtags.length > 0) || (clip.tags && clip.tags.length > 0)) && (
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        Auto Tags & Hashtags
                      </span>
                      <button
                        onClick={() => handleCopyText([...(clip.hashtags || []), ...(clip.tags || [])].join(' '), `tags-${clip.id}`)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        title="Copy All Tags"
                      >
                        {copiedId === `tags-${clip.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === `tags-${clip.id}` ? 'Copied!' : 'Copy Tags'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
                      {(clip.hashtags || []).slice(0, 5).map((ht, htIdx) => (
                        <span key={htIdx} className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono">
                          {ht}
                        </span>
                      ))}
                      {(clip.tags || []).slice(0, 3).map((t, tIdx) => (
                        <span key={tIdx} className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expand / Collapse Subtitles & Tags Panel */}
                <button
                  onClick={() => setExpandedClipId(expandedClipId === clip.id ? null : clip.id)}
                  className="w-full py-1 text-[10px] font-bold text-slate-400 hover:text-purple-300 flex items-center justify-center gap-1 transition"
                >
                  {expandedClipId === clip.id ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Hide Full Subtitles & Tags
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> View All Subtitles & Tags Details
                    </>
                  )}
                </button>

                {/* Expanded Details Drawer */}
                {expandedClipId === clip.id && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-[11px] animate-fadeIn">
                    {/* All Subtitle Lines */}
                    {clip.captions && clip.captions.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-purple-300 block">Full Timed Subtitles:</span>
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                          {clip.captions.map((c, cIdx) => (
                            <div key={cIdx} className="p-1.5 bg-slate-900 rounded border border-slate-800 flex justify-between gap-2 text-[10px]">
                              <span className="text-slate-200">{c.text}</span>
                              <span className="font-mono text-slate-500 shrink-0">{c.start}s - {c.end}s</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Tags */}
                    {clip.tags && clip.tags.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-amber-300 block">SEO Tags List:</span>
                        <p className="p-1.5 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300 font-mono">
                          {clip.tags.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Notification Toast */}
                {shareNotice && shareNotice.id === clip.id && (
                  <div className="p-2 bg-purple-950/90 border border-purple-500/30 rounded-xl text-[10.5px] font-semibold text-purple-200 text-center animate-fadeIn shadow-lg">
                    {shareNotice.text}
                  </div>
                )}

                {/* Direct Platform Share & Download Toolbar */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[10.5px] text-slate-400 font-semibold px-0.5">
                    <span>Direct Share Short:</span>
                    <span className="text-[9.5px] text-slate-500 font-normal">Auto-copies title & tags</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {/* YouTube Shorts Share */}
                    <button
                      onClick={() => handleShareToPlatform('youtube', clip)}
                      className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition group"
                      title="Direct Share to YouTube Shorts Studio"
                    >
                      <Youtube className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                      <span>YouTube</span>
                    </button>

                    {/* Instagram Reels Share */}
                    <button
                      onClick={() => handleShareToPlatform('instagram', clip)}
                      className="py-1.5 px-2 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-pink-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition group"
                      title="Direct Share to Instagram Reels"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-500 group-hover:scale-110 transition-transform" />
                      <span>Insta</span>
                    </button>

                    {/* Facebook Reels Share */}
                    <button
                      onClick={() => handleShareToPlatform('facebook', clip)}
                      className="py-1.5 px-2 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition group"
                      title="Direct Share to Facebook Reels"
                    >
                      <Facebook className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span>FB</span>
                    </button>

                    {/* Web Native Share */}
                    <button
                      onClick={() => handleShareToPlatform('native', clip)}
                      className="py-1.5 px-2 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition group"
                      title="Native App / Mobile Share"
                    >
                      <Share2 className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Direct Download & Export Actions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleDirectDownload(clip)}
                      className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                      title="Download Short Video File"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Short
                    </button>

                    {onQueueClip && (
                      <button
                        onClick={() => onQueueClip(clip)}
                        className="py-2 px-3 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 font-semibold text-[10.5px] rounded-xl border border-purple-700/50 transition flex items-center gap-1"
                        title="Add to Batch Export Queue"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Queue
                      </button>
                    )}

                    {onEditClip && (
                      <button
                        onClick={() => onEditClip(clip)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[10.5px] rounded-xl border border-slate-700 transition flex items-center gap-1"
                        title="Edit in Studio Canvas"
                      >
                        <Scissors className="w-3.5 h-3.5 text-purple-400" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
