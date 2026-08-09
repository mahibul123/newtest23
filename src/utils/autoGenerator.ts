import { CaptionLine, CaptionWord } from '../types';

interface AutoGeneratorResult {
  captions: CaptionLine[];
  tags: string[];
  hashtags: string[];
}

const HOOK_LINES = [
  "YOU WON'T BELIEVE THIS SECRET! 🔥",
  "THE CRAZIEST VIRAL HACK EVER 😱",
  "STOP DOING THIS WRONG! ⚡",
  "99% OF PEOPLE MISS THIS TRICK! 🤯",
  "THIS WILL CHANGE EVERYTHING 👇",
  "MIND BLOWN IN 5 SECONDS 💥",
  "UNBELIEVABLE TRANSFORMATION ✨",
  "THE ULTIMATE SHORTCUT YOU NEED 🚀",
];

const DEMO_LINES = [
  "Watch closely as we break this down step-by-step 💡",
  "This technique doubles your retention instantly 👀",
  "Look at how fast this visual transition works 🎯",
  "Notice the secret detail right over here 🔍",
  "Most creators never reveal this secret formula 🤫",
  "Here is the exact method top influencers use 🔥",
];

const PAYOFF_LINES = [
  "It saves hours of editing and boosts reach 📈",
  "Try this trick on your very next video 🎬",
  "Simple, fast, and 100% effective guaranteed 💯",
  "Share this with someone who needs to see it 💬",
  "The results speak completely for themselves 🌟",
];

const CTA_LINES = [
  "LIKE & FOLLOW for daily viral hacks! 🔔",
  "SUBSCRIBE now for more game-changing shorts! 🚀",
  "Comment your thoughts below! 💬",
  "Save this short so you don't lose it! 📌",
];

export function generateAutoSubtitlesAndTags(
  videoName: string,
  startTime: number,
  endTime: number
): AutoGeneratorResult {
  const duration = Math.max(3, endTime - startTime);
  const cleanTopic = videoName
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .trim() || 'Viral Short';

  // Determine line count based on clip duration (1 line per ~3-4 seconds)
  const lineCount = Math.min(5, Math.max(2, Math.floor(duration / 3.5)));
  const lineDuration = duration / lineCount;

  const captionPool = [
    HOOK_LINES[Math.floor(Math.random() * HOOK_LINES.length)],
    DEMO_LINES[Math.floor(Math.random() * DEMO_LINES.length)],
    PAYOFF_LINES[Math.floor(Math.random() * PAYOFF_LINES.length)],
    CTA_LINES[Math.floor(Math.random() * CTA_LINES.length)],
  ];

  const captions: CaptionLine[] = [];

  for (let i = 0; i < lineCount; i++) {
    const start = Number((startTime + i * lineDuration + 0.2).toFixed(2));
    const end = Number((startTime + (i + 1) * lineDuration - 0.1).toFixed(2));
    const text = captionPool[i % captionPool.length];

    const wordsArr = text.split(' ');
    const wordDuration = (end - start) / Math.max(1, wordsArr.length);

    const words: CaptionWord[] = wordsArr.map((w, wIdx) => ({
      text: w,
      start: Number((start + wIdx * wordDuration).toFixed(2)),
      end: Number((start + (wIdx + 1) * wordDuration).toFixed(2)),
    }));

    captions.push({
      id: `auto-cap-${i}-${Date.now()}`,
      start,
      end,
      text,
      words,
    });
  }

  // Generate Tags & Hashtags
  const topicTag = cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '');

  const hashtags = [
    '#shorts',
    '#viral',
    '#trending',
    '#fyp',
    '#reels',
    '#tiktok',
    `#${topicTag || 'viralshorts'}`,
    '#foryoupage',
    '#learnontiktok',
    '#contentcreator',
  ];

  const tags = [
    cleanTopic,
    `${cleanTopic} tips`,
    `${cleanTopic} hack`,
    `viral ${cleanTopic}`,
    'youtube shorts',
    'tiktok viral',
    'instagram reels',
    'trending short',
    'how to viral',
    'reelsnip ai',
  ];

  return { captions, tags, hashtags };
}
