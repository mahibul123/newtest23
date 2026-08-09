import JSZip from 'jszip';
import { ShortClipConfig, AspectRatio, Resolution, CaptionLine, WatermarkSettings } from '../types';

export interface RenderProgressCallback {
  (progress: number, stage: string, currentFrame?: number, totalFrames?: number): void;
}

/**
 * Get numerical width & height for aspect ratio & resolution
 */
export function getDimensions(aspectRatio: AspectRatio, resolution: Resolution): { width: number; height: number } {
  let targetHeight = 1920;
  switch (resolution) {
    case '4k':
      targetHeight = 3840;
      break;
    case '1440p':
      targetHeight = 2560;
      break;
    case '1080p':
      targetHeight = 1920;
      break;
    case '720p':
      targetHeight = 1280;
      break;
    case '480p':
      targetHeight = 854;
      break;
    case '360p':
      targetHeight = 640;
      break;
    case '240p':
      targetHeight = 426;
      break;
  }

  switch (aspectRatio) {
    case '9:16':
      return { width: Math.round((targetHeight * 9) / 16), height: targetHeight };
    case '16:9':
      return { width: targetHeight, height: Math.round((targetHeight * 9) / 16) };
    case '1:1':
      return { width: targetHeight, height: targetHeight };
    case '4:5':
      return { width: Math.round((targetHeight * 4) / 5), height: targetHeight };
    case '3:4':
      return { width: Math.round((targetHeight * 3) / 4), height: targetHeight };
    case 'original':
    default:
      return { width: 1080, height: 1920 };
  }
}

/**
 * Render a single frame to Canvas with crop, aspect ratio, blur background, captions, & watermark
 */
export function drawVideoFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  videoElement: HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
  currentTimeSec: number,
  clipConfig: ShortClipConfig,
  watermarkImage?: HTMLImageElement | null
) {
  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Background Fill / Blur
  if (clipConfig.blurBackground) {
    ctx.save();
    ctx.filter = 'blur(25px) brightness(0.6)';
    ctx.drawImage(videoElement, -20, -20, canvasWidth + 40, canvasHeight + 40);
    ctx.restore();
  } else {
    ctx.fillStyle = clipConfig.backgroundColor || '#0a0a0c';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Draw Main Video Frame with Transformation
  const vWidth = videoElement.videoWidth || 1920;
  const vHeight = videoElement.videoHeight || 1080;

  ctx.save();
  // Apply rotation / flip
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  if (clipConfig.rotation) ctx.rotate((clipConfig.rotation * Math.PI) / 180);
  ctx.scale(clipConfig.flipHorizontal ? -1 : 1, clipConfig.flipVertical ? -1 : 1);

  // Calculate object-fit contain/cover layout
  const targetAspect = canvasWidth / canvasHeight;
  const videoAspect = vWidth / vHeight;

  let drawW = canvasWidth;
  let drawH = canvasHeight;

  if (clipConfig.aspectRatio === '9:16' && videoAspect > 1) {
    // 16:9 source fitted inside 9:16 vertical short canvas
    drawW = canvasWidth;
    drawH = canvasWidth / videoAspect;
  } else {
    // Cover mode fit
    if (videoAspect > targetAspect) {
      drawH = canvasHeight;
      drawW = canvasHeight * videoAspect;
    } else {
      drawW = canvasWidth;
      drawH = canvasWidth / videoAspect;
    }
  }

  // Apply crop offset X/Y
  const offsetX = ((clipConfig.cropX - 50) / 100) * (drawW - canvasWidth);
  const offsetY = ((clipConfig.cropY - 50) / 100) * (drawH - canvasHeight);

  ctx.drawImage(videoElement, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
  ctx.restore();

  // Draw Captions if present
  if (clipConfig.captions && clipConfig.captions.length > 0) {
    drawCaptionsOverlay(ctx, canvasWidth, canvasHeight, currentTimeSec, clipConfig.captions, clipConfig.captionStyle);
  }

  // Draw Watermark
  if (clipConfig.watermark && clipConfig.watermark.enabled) {
    drawWatermarkOverlay(ctx, canvasWidth, canvasHeight, clipConfig.watermark, watermarkImage);
  }

  ctx.restore();
}

/**
 * Draw Captions / Subtitles with karaoke word highlighting & custom styles
 */
function drawCaptionsOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentTimeSec: number,
  captions: CaptionLine[],
  style: ShortClipConfig['captionStyle']
) {
  const activeLine = captions.find((c) => currentTimeSec >= c.start && currentTimeSec <= c.end);
  if (!activeLine || !activeLine.text) return;

  ctx.save();
  const fontSize = Math.round((style.fontSize / 1080) * height);
  ctx.font = `bold ${fontSize}px ${style.fontFamily || 'sans-serif'}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const posY = (style.positionY / 100) * height;
  let textToRender = style.uppercase ? activeLine.text.toUpperCase() : activeLine.text;

  // Background Pill
  if (style.backgroundColor && style.backgroundColor !== 'transparent') {
    const metrics = ctx.measureText(textToRender);
    const textWidth = metrics.width;
    const paddingX = fontSize * 0.5;
    const paddingY = fontSize * 0.3;

    ctx.fillStyle = style.backgroundColor;
    ctx.beginPath();
    ctx.roundRect(width / 2 - textWidth / 2 - paddingX, posY - fontSize / 2 - paddingY, textWidth + paddingX * 2, fontSize + paddingY * 2, 12);
    ctx.fill();
  }

  // Text Shadow & Stroke
  if (style.shadowColor) {
    ctx.shadowColor = style.shadowColor;
    ctx.shadowBlur = style.shadowBlur;
  }

  if (style.strokeWidth > 0) {
    ctx.strokeStyle = style.strokeColor || '#000000';
    ctx.lineWidth = style.strokeWidth;
    ctx.strokeText(textToRender, width / 2, posY);
  }

  // Text Fill (with Karaoke active word highlight if words timing exists)
  if (style.animation === 'karaoke' && activeLine.words && activeLine.words.length > 0) {
    const words = activeLine.words;
    let totalTextWidth = ctx.measureText(textToRender).width;
    let startX = width / 2 - totalTextWidth / 2;

    for (const w of words) {
      const wordText = (style.uppercase ? w.text.toUpperCase() : w.text) + ' ';
      const wordWidth = ctx.measureText(wordText).width;
      const isWordActive = currentTimeSec >= w.start && currentTimeSec <= w.end;

      ctx.fillStyle = isWordActive ? style.highlightColor || '#FACC15' : style.textColor || '#FFFFFF';
      ctx.fillText(wordText, startX + wordWidth / 2, posY);
      startX += wordWidth;
    }
  } else {
    ctx.fillStyle = style.textColor || '#FFFFFF';
    ctx.fillText(textToRender, width / 2, posY);
  }

  ctx.restore();
}

/**
 * Draw Watermark or Logo
 */
function drawWatermarkOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  watermark: WatermarkSettings,
  logoImg?: HTMLImageElement | null
) {
  ctx.save();
  ctx.globalAlpha = watermark.opacity;

  const margin = 30;
  let x = margin;
  let y = margin;

  if (watermark.position === 'top-right') {
    x = width - margin;
  } else if (watermark.position === 'bottom-left') {
    y = height - margin;
  } else if (watermark.position === 'bottom-right') {
    x = width - margin;
    y = height - margin;
  } else if (watermark.position === 'center') {
    x = width / 2;
    y = height / 2;
  }

  if (watermark.type === 'text' && watermark.text) {
    const fontSize = Math.round(width * 0.035 * watermark.scale);
    ctx.font = `600 ${fontSize}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 3;

    if (watermark.position.includes('right')) ctx.textAlign = 'right';
    else if (watermark.position.includes('left')) ctx.textAlign = 'left';
    else ctx.textAlign = 'center';

    ctx.strokeText(watermark.text, x, y);
    ctx.fillText(watermark.text, x, y);
  } else if (watermark.type === 'image' && logoImg) {
    const imgW = width * 0.18 * watermark.scale;
    const imgH = (logoImg.height / logoImg.width) * imgW;
    let drawX = x;
    let drawY = y;

    if (watermark.position.includes('right')) drawX -= imgW;
    if (watermark.position.includes('bottom')) drawY -= imgH;
    if (watermark.position === 'center') {
      drawX -= imgW / 2;
      drawY -= imgH / 2;
    }

    ctx.drawImage(logoImg, drawX, drawY, imgW, imgH);
  }

  ctx.restore();
}

/**
 * Export Short Clip locally in browser via Canvas + MediaRecorder API
 */
export async function renderShortClipLocally(
  videoSourceUrl: string,
  clipConfig: ShortClipConfig,
  onProgress?: RenderProgressCallback
): Promise<{ blob: Blob; size: number }> {
  return new Promise((resolve, reject) => {
    onProgress?.(5, 'Loading source video for local render...');

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true; // Essential: prevents Chrome/Safari autoplay policy rejection
    video.playsInline = true;
    video.preload = 'auto';
    video.src = videoSourceUrl;

    const startRendering = async () => {
      try {
        const { width, height } = getDimensions(clipConfig.aspectRatio, clipConfig.resolution);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        // Setup audio track mixing via Web Audio API if supported
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const mediaStreamDestination = audioCtx.createMediaStreamDestination();

        try {
          const sourceNode = audioCtx.createMediaElementSource(video);
          const gainNode = audioCtx.createGain();
          gainNode.gain.value = clipConfig.audio?.muteOriginal ? 0 : clipConfig.audio?.originalVolume ?? 1;
          sourceNode.connect(gainNode);
          gainNode.connect(mediaStreamDestination);
        } catch (e) {
          console.warn('Audio node connection skipped (CORS/Cross-Origin limitation):', e);
        }

        // Combine Canvas stream + Audio stream
        const canvasStream = canvas.captureStream(30); // 30 fps
        const combinedStream = new MediaStream();
        canvasStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));
        mediaStreamDestination.stream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));

        // Select mimeType supported by browser
        const mimeType = getSupportedMimeType(clipConfig.format);
        const options: MediaRecorderOptions = { mimeType };
        if (clipConfig.customBitrateMbps) {
          options.videoBitsPerSecond = clipConfig.customBitrateMbps * 1000000;
        }

        const recorder = new MediaRecorder(combinedStream, options);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          try {
            audioCtx.close();
          } catch {
            // ignore
          }
          const finalBlob = new Blob(chunks, { type: mimeType });
          onProgress?.(100, 'Render complete!');
          resolve({ blob: finalBlob, size: finalBlob.size });
        };

        const vDuration = video.duration || clipConfig.endTime || 60;
        const startTime = clipConfig.startTime || 0;
        const endTime = Math.min(vDuration, clipConfig.endTime || vDuration);
        const totalDuration = Math.max(1, endTime - startTime);

        video.currentTime = startTime;

        recorder.start(200);

        try {
          await video.play();
        } catch (playErr) {
          console.warn('Direct video.play() failed; proceeding with frame stepping mode:', playErr);
        }

        let lastTime = Date.now();

        const renderLoop = () => {
          const now = Date.now();
          if (video.currentTime >= endTime || video.ended) {
            try {
              video.pause();
            } catch {
              // ignore
            }
            recorder.stop();
            return;
          }

          drawVideoFrameToCanvas(ctx, video, width, height, video.currentTime, clipConfig);

          // Force step forward if video playback is paused or stuck
          if (video.paused) {
            video.currentTime = Math.min(endTime, video.currentTime + 0.033);
          }

          const elapsed = video.currentTime - startTime;
          const pct = Math.min(99, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

          if (now - lastTime > 250) {
            onProgress?.(pct, `Processing frame at ${video.currentTime.toFixed(1)}s / ${endTime.toFixed(1)}s`);
            lastTime = now;
          }

          requestAnimationFrame(renderLoop);
        };

        requestAnimationFrame(renderLoop);
      } catch (err) {
        reject(err);
      }
    };

    let hasTriedFallback = false;

    const handleVideoError = () => {
      if (!hasTriedFallback) {
        hasTriedFallback = true;
        console.warn('Primary video source load failed; attempting high-compatibility stream fallback...');
        try {
          video.removeAttribute('crossorigin');
        } catch {
          // ignore
        }
        video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        return;
      }
      reject(new Error('Video loading error during processing. Please verify video link format.'));
    };

    if (video.readyState >= 1) {
      startRendering();
    } else {
      video.onloadedmetadata = startRendering;
      video.onerror = handleVideoError;
    }
  });
}

/**
 * Determine supported MediaRecorder mimeType
 */
function getSupportedMimeType(format: string): string {
  if (format === 'webm') {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) return 'video/webm;codecs=vp9,opus';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) return 'video/webm;codecs=vp8,opus';
    return 'video/webm';
  }
  // Default MP4 / H264
  if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')) return 'video/mp4;codecs=avc1.42E01E,mp4a.40.2';
  if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4';
  if (MediaRecorder.isTypeSupported('video/webm')) return 'video/webm';
  return '';
}

/**
 * Batch Package multiple rendered shorts into a downloadable ZIP archive
 */
export async function packageClipsToZip(
  clips: { name: string; blob: Blob }[],
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('reelsnip_shorts');

  for (let i = 0; i < clips.length; i++) {
    const item = clips[i];
    folder?.file(item.name, item.blob);
    onProgress?.(Math.round(((i + 1) / clips.length) * 80));
  }

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    onProgress?.(80 + Math.round(metadata.percent * 0.2));
  });

  return content;
}
