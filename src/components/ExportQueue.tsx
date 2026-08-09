import React, { useState } from 'react';
import { 
  PackageCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  FolderArchive, 
  Terminal, 
  Trash2, 
  RefreshCw, 
  Sparkles,
  Zap
} from 'lucide-react';
import { ShortClipConfig, ConsoleLogMessage, VideoMetadata } from '../types';
import { renderShortClipLocally, packageClipsToZip } from '../utils/videoProcessor';
import { ViralShortsPreviewGrid } from './ViralShortsPreviewGrid';

interface ExportQueueProps {
  clips: ShortClipConfig[];
  videos: VideoMetadata[];
  logs: ConsoleLogMessage[];
  onUpdateClipStatus: (clipId: string, status: ShortClipConfig['status'], progress: number, blob?: Blob, error?: string) => void;
  onClearQueue: () => void;
  onRemoveClip: (clipId: string) => void;
  onAddLog: (msg: string, type?: ConsoleLogMessage['type']) => void;
}

export const ExportQueue: React.FC<ExportQueueProps> = ({
  clips,
  videos,
  logs,
  onUpdateClipStatus,
  onClearQueue,
  onRemoveClip,
  onAddLog,
}) => {
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const completedClips = clips.filter((c) => c.status === 'completed');
  const queuedClips = clips.filter((c) => c.status === 'queued');
  const failedClips = clips.filter((c) => c.status === 'failed');

  // Process all queued clips in order
  const handleProcessAllQueue = async () => {
    if (queuedClips.length === 0 || isProcessingQueue) return;
    setIsProcessingQueue(true);

    onAddLog(`Starting batch rendering queue (${queuedClips.length} items)...`, 'info');

    for (const clip of queuedClips) {
      const sourceVideo = videos.find((v) => v.id === clip.sourceVideoId);
      if (!sourceVideo) {
        onUpdateClipStatus(clip.id, 'failed', 0, undefined, 'Source video not found');
        onAddLog(`Failed to process ${clip.title}: source video missing`, 'error');
        continue;
      }

      onUpdateClipStatus(clip.id, 'processing', 0);
      onAddLog(`Rendering ${clip.title} (${clip.aspectRatio}, ${clip.resolution})...`, 'info');

      try {
        const result = await renderShortClipLocally(sourceVideo.url, clip, (pct, stage) => {
          onUpdateClipStatus(clip.id, 'processing', pct);
        });

        onUpdateClipStatus(clip.id, 'completed', 100, result.blob);
        onAddLog(`Successfully rendered ${clip.title} (${(result.size / 1048576).toFixed(1)} MB)`, 'success');
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        onUpdateClipStatus(clip.id, 'failed', 0, undefined, errMsg);
        onAddLog(`Error rendering ${clip.title}: ${errMsg}`, 'error');
      }
    }

    setIsProcessingQueue(false);
    onAddLog('Batch queue processing completed!', 'success');
  };

  const handleDownloadSingle = (clip: ShortClipConfig) => {
    if (!clip.resultBlob) return;
    const url = URL.createObjectURL(clip.resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = clip.title;
    a.click();
  };

  const handleDownloadZip = async () => {
    if (completedClips.length === 0 || isZipping) return;
    setIsZipping(true);
    setZipProgress(0);
    onAddLog(`Packaging ${completedClips.length} clips into ZIP archive...`, 'info');

    try {
      const itemsToZip = completedClips.map((c) => ({
        name: c.title,
        blob: c.resultBlob!,
      }));

      const zipBlob = await packageClipsToZip(itemsToZip, (pct) => {
        setZipProgress(pct);
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reelsnip_shorts_${Date.now()}.zip`;
      a.click();

      onAddLog('ZIP package downloaded successfully!', 'success');
    } catch (err) {
      onAddLog('ZIP creation failed: ' + String(err), 'error');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-purple-400" />
            Batch Export Queue & ZIP Downloader
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time local browser video rendering queue with progress tracking and 1-click ZIP export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {completedClips.length > 0 && (
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
            >
              <FolderArchive className="w-4 h-4" />
              {isZipping ? `Zipping (${zipProgress}%)...` : `Download All (${completedClips.length} ZIP)`}
            </button>
          )}

          {queuedClips.length > 0 && (
            <button
              onClick={handleProcessAllQueue}
              disabled={isProcessingQueue}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              {isProcessingQueue ? 'Rendering Queue...' : `Start Queue (${queuedClips.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Total Queued</span>
          <span className="text-xl font-extrabold text-amber-400 mt-1 block">{queuedClips.length}</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Completed</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{completedClips.length}</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Failed</span>
          <span className="text-xl font-extrabold text-red-400 mt-1 block">{failedClips.length}</span>
        </div>
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Total Clips</span>
          <span className="text-xl font-extrabold text-purple-400 mt-1 block">{clips.length}</span>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">Processing Tasks</h3>
          {clips.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Queue
            </button>
          )}
        </div>

        {clips.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/20 rounded-2xl border border-slate-800 space-y-2">
            <PackageCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">Queue is empty. Use Auto Shorts Creator or Live Editor to add clips.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">{clip.title}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-slate-800 text-slate-400 uppercase font-mono">
                      {clip.aspectRatio} | {clip.resolution}
                    </span>
                  </div>

                  {clip.status === 'processing' && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-purple-300 font-mono">
                        <span>Rendering local frame canvas...</span>
                        <span>{clip.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all duration-200"
                          style={{ width: `${clip.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {clip.error && (
                    <span className="text-[10px] text-red-400 font-mono block">{clip.error}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-end">
                  {clip.status === 'completed' && (
                    <button
                      onClick={() => handleDownloadSingle(clip)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download MP4
                    </button>
                  )}

                  <button
                    onClick={() => onRemoveClip(clip.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Processing Status Guarantee Card */}
      {clips.length > 0 && (
        <ViralShortsPreviewGrid
          clips={clips}
          activeVideo={videos[0] || null}
        />
      )}

      <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-200">Gemini 3.6 Flash & WebCodecs Rendering Pipeline</h4>
            <p className="text-[11px] text-slate-400">
              Clean local background processing enabled. Detailed technical logs are available in the Settings tab.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          Canvas GPU Ready
        </div>
      </div>
    </div>
  );
};
