import { HighlightSegment } from '../types';

/**
 * Browser-based local Smart Video AI Detector
 * Analyzes video element canvas frames and audio buffer peaks without uploading to any server.
 */
export async function detectVideoHighlights(
  videoElement: HTMLVideoElement,
  options: {
    targetDuration: number; // e.g. 15, 30, 60
    sampleIntervalSec?: number;
    onProgress?: (pct: number, stage: string) => void;
  }
): Promise<HighlightSegment[]> {
  const { targetDuration, sampleIntervalSec = 1.0, onProgress } = options;
  const duration = videoElement.duration;

  if (!duration || isNaN(duration) || duration <= targetDuration) {
    return [
      {
        id: 'hl-01',
        startTime: 0,
        endTime: Math.min(duration || targetDuration, targetDuration),
        duration: Math.min(duration || targetDuration, targetDuration),
        score: 95,
        reason: 'ai_detected',
        label: 'Full Clip Highlight',
      },
    ];
  }

  onProgress?.(10, 'Extracting audio & scene markers...');

  // 1. Analyze Audio Peaks if possible
  const audioScores: { time: number; score: number }[] = [];
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const sourceUrl = videoElement.src;
    
    // Fetch audio buffer for fast offline peak detection
    const response = await fetch(sourceUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const rawData = audioBuffer.getChannelData(0); // channel 1
    const sampleRate = audioBuffer.sampleRate;
    const step = Math.floor(sampleRate * sampleIntervalSec);
    
    for (let i = 0; i < rawData.length; i += step) {
      const time = i / sampleRate;
      let sum = 0;
      const subLength = Math.min(step, rawData.length - i);
      for (let j = 0; j < subLength; j += 100) {
        sum += Math.abs(rawData[i + j]);
      }
      const avgPeak = (sum / (subLength / 100)) * 100;
      audioScores.push({ time, score: Math.min(100, avgPeak * 3) });
    }
    audioContext.close();
  } catch (audioErr) {
    console.warn('Local Audio peak analyzer skipped (fallback to interval grid):', audioErr);
  }

  onProgress?.(50, 'Analyzing motion & visual energy...');

  // 2. Sample Canvas Frames for motion / scene changes
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 90;
  const ctx = canvas.getContext('2d');

  const visualScores: { time: number; score: number; sceneChange: boolean }[] = [];
  let prevImageData: Uint8ClampedArray | null = null;

  const totalSteps = Math.floor(duration / sampleIntervalSec);
  
  for (let i = 0; i < totalSteps; i += Math.max(1, Math.floor(totalSteps / 30))) {
    const time = i * sampleIntervalSec;
    
    // Calculate motion delta if ctx exists
    let motionScore = 50;
    let sceneChange = false;

    if (ctx) {
      try {
        videoElement.currentTime = time;
        await new Promise((res) => {
          const handler = () => {
            videoElement.removeEventListener('seeked', handler);
            res(true);
          };
          videoElement.addEventListener('seeked', handler);
          setTimeout(res, 200);
        });

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        if (prevImageData) {
          let diff = 0;
          for (let p = 0; p < currentData.length; p += 16) {
            diff += Math.abs(currentData[p] - prevImageData[p]);
          }
          const avgDiff = diff / (currentData.length / 16);
          motionScore = Math.min(100, avgDiff * 2.5);
          if (avgDiff > 35) sceneChange = true;
        }
        prevImageData = currentData;
      } catch (e) {
        // Cross-origin image seek restriction fallback
      }
    }

    visualScores.push({ time, score: motionScore, sceneChange });
    onProgress?.(50 + Math.floor((i / totalSteps) * 40), `Scanning segment at ${Math.floor(time)}s...`);
  }

  onProgress?.(95, 'Ranking top viral viral moments...');

  // 3. Combine scores into candidates
  const candidates: HighlightSegment[] = [];
  const clipCount = Math.max(1, Math.floor(duration / targetDuration));
  const stepTime = duration / clipCount;

  for (let c = 0; c < clipCount; c++) {
    const startTime = c * stepTime;
    const endTime = Math.min(duration, startTime + targetDuration);
    
    // Find audio peak in window
    const audioWin = audioScores.filter((a) => a.time >= startTime && a.time <= endTime);
    const avgAudio = audioWin.length ? audioWin.reduce((acc, v) => acc + v.score, 0) / audioWin.length : 60;

    const visWin = visualScores.filter((v) => v.time >= startTime && v.time <= endTime);
    const avgVis = visWin.length ? visWin.reduce((acc, v) => acc + v.score, 0) / visWin.length : 50;
    const hasSceneChange = visWin.some((v) => v.sceneChange);

    const combinedScore = Math.round(avgAudio * 0.5 + avgVis * 0.4 + (hasSceneChange ? 10 : 0));

    candidates.push({
      id: `hl-${c + 1}`,
      startTime: Math.round(startTime * 10) / 10,
      endTime: Math.round(endTime * 10) / 10,
      duration: Math.round((endTime - startTime) * 10) / 10,
      score: Math.min(99, Math.max(40, combinedScore)),
      reason: hasSceneChange ? 'scene_change' : avgAudio > 70 ? 'audio_peak' : avgVis > 65 ? 'high_motion' : 'speech',
      label: `Key Highlight ${c + 1} (${Math.floor(startTime)}s - ${Math.floor(endTime)}s)`,
    });
  }

  onProgress?.(100, 'Smart Detection complete!');

  return candidates.sort((a, b) => b.score - a.score);
}
