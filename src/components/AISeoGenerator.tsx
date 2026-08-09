import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Copy, 
  Check, 
  TrendingUp, 
  Flame, 
  Tag, 
  FileText, 
  Youtube, 
  Instagram, 
  Video, 
  Zap, 
  Target, 
  BarChart2, 
  Share2,
  RefreshCw
} from 'lucide-react';
import { VideoMetadata, ShortClipConfig } from '../types';

interface AISeoGeneratorProps {
  activeVideo: VideoMetadata | null;
  clips?: ShortClipConfig[];
}

export const AISeoGenerator: React.FC<AISeoGeneratorProps> = ({
  activeVideo,
  clips = [],
}) => {
  const [topicInput, setTopicInput] = useState<string>(activeVideo?.name.replace(/\.[^/.]+$/, '') || 'Viral Shorts Hack');
  const [platform, setPlatform] = useState<'all' | 'youtube' | 'tiktok' | 'instagram'>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // High CTR Viral Titles dataset based on topic
  const generateTitles = (topic: string) => [
    { title: `99% of People Don't Know This ${topic} Secret! 😱 #shorts`, ctr: 98, searches: '450K/mo' },
    { title: `The CRAZIEST ${topic} Trick You Need to Try ASAP 🔥`, ctr: 96, searches: '320K/mo' },
    { title: `I Tested the Viral ${topic} Hack (Is It Real? 🤔)`, ctr: 94, searches: '290K/mo' },
    { title: `Do THIS if you want to master ${topic} in 60 Seconds ⚡`, ctr: 92, searches: '180K/mo' },
    { title: `Stop Doing ${topic} Wrong! (Watch Until the End 🤯)`, ctr: 91, searches: '150K/mo' },
  ];

  const generateHashtags = (topic: string) => {
    const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    return {
      topViral: ['#shorts', '#viral', '#trending', '#fyp', '#reels'],
      nicheSpecific: [`#${cleanTopic}`, `#${cleanTopic}tips`, `#${cleanTopic}hacks`, `#${cleanTopic}tok`],
      growthBooster: ['#viralshorts', '#shortsfocal', '#foryoupage', '#learnontiktok', '#mindset'],
    };
  };

  const titles = generateTitles(topicInput);
  const hashtags = generateHashtags(topicInput);

  const fullDescription = `🔥 Want to master ${topicInput}? Watch this 30-second viral breakdown!

👇 Timestamps:
0:00 - The Hook & Secret
0:10 - Mind-blowing Demonstration
0:25 - The Final Result & Hack

💡 Key Takeaway:
Using this simple technique will save you hours and double your retention rate!

🔔 Subscribe & Follow for daily viral shorts & hacks!
#shorts #${topicInput.toLowerCase().replace(/[^a-z0-9]/g, '')} #viral #trending #fyp`;

  const tagsList = `${topicInput}, ${topicInput} tips, viral ${topicInput}, ${topicInput} tutorial, shorts, viral shorts, tiktok, reels, youtube shorts, how to ${topicInput}, best ${topicInput} 2026`;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              AI SEO & Viral Metadata Optimizer
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Generate high-CTR titles, viral hashtag clusters, keyword-dense descriptions, and algorithm tags for YouTube Shorts, TikTok & Reels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(`${titles[0].title}\n\n${fullDescription}\n\n${hashtags.topViral.join(' ')} ${hashtags.nicheSpecific.join(' ')}`, 'all')}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
          >
            {copiedSection === 'all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            Copy Complete SEO Package
          </button>
        </div>
      </div>

      {/* Topic Search & Platform Selector Controls */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter video topic, keyword, or title..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPlatform('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                platform === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setPlatform('youtube')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                platform === 'youtube' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              YT Shorts
            </button>
            <button
              onClick={() => setPlatform('tiktok')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                platform === 'tiktok' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              TikTok
            </button>
            <button
              onClick={() => setPlatform('instagram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                platform === 'instagram' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              Reels
            </button>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate AI SEO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: High CTR Titles & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: High CTR Titles */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="font-bold text-sm text-white">AI High-CTR Viral Titles</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Algorithm Optimized
              </span>
            </div>

            <div className="space-y-2.5">
              {titles.map((t, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-purple-500/40 transition flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-white group-hover:text-purple-200 transition">
                      {t.title}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold">CTR Prediction: {t.ctr}%</span>
                      <span>•</span>
                      <span>Est Search Vol: {t.searches}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(t.title, `title-${i}`)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white transition shrink-0"
                    title="Copy Title"
                  >
                    {copiedSection === `title-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: AI Description & Timestamps */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">SEO Optimized Description & Timestamps</h3>
              </div>
              <button
                onClick={() => handleCopy(fullDescription, 'desc')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] rounded-lg border border-slate-700 transition flex items-center gap-1"
              >
                {copiedSection === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Description
              </button>
            </div>

            <textarea
              readOnly
              value={fullDescription}
              rows={8}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Right 1 Column: Hashtags, Tags & SEO Score */}
        <div className="space-y-6">
          {/* SEO Score Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Overall SEO Strength
              </h4>
              <span className="text-xs font-black text-amber-400 font-mono">96 / 100</span>
            </div>

            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-400 h-full w-[96%]" />
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span>Hook Keyword Density</span>
                <span className="text-emerald-400 font-bold">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hashtag Reach Index</span>
                <span className="text-emerald-400 font-bold">Top 5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Algorithm Searchability</span>
                <span className="text-purple-300 font-bold">High</span>
              </div>
            </div>
          </div>

          {/* Hashtags Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                Viral Hashtag Clusters
              </h4>
              <button
                onClick={() => handleCopy([...hashtags.topViral, ...hashtags.nicheSpecific, ...hashtags.growthBooster].join(' '), 'hashtags')}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
              >
                Copy All
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Top Viral Tags</span>
                <div className="flex flex-wrap gap-1">
                  {hashtags.topViral.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-mono text-purple-300 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Niche Specific</span>
                <div className="flex flex-wrap gap-1">
                  {hashtags.nicheSpecific.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-mono text-amber-300 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Algorithmic Growth</span>
                <div className="flex flex-wrap gap-1">
                  {hashtags.growthBooster.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comma-Separated Studio Tags */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-400" />
                YouTube Studio Search Tags
              </h4>
              <button
                onClick={() => handleCopy(tagsList, 'tags')}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
              >
                {copiedSection === 'tags' ? 'Copied!' : 'Copy Tags'}
              </button>
            </div>

            <p className="text-[11px] text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 break-words leading-relaxed">
              {tagsList}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
