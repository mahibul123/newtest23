import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoImporter } from './components/VideoImporter';
import { AutoShortsGenerator } from './components/AutoShortsGenerator';
import { SmartDetectorView } from './components/SmartDetectorView';
import { VideoEditorCanvas } from './components/VideoEditorCanvas';
import { CaptionEditor } from './components/CaptionEditor';
import { AudioVoiceOver } from './components/AudioVoiceOver';
import { VideoToolsSuite } from './components/VideoToolsSuite';
import { AISeoGenerator } from './components/AISeoGenerator';
import { ExportQueue } from './components/ExportQueue';
import { ConsoleLogsSettings } from './components/ConsoleLogsSettings';
import { PlatformPresetsModal } from './components/PlatformPresetsModal';

import { 
  VideoMetadata, 
  ShortClipConfig, 
  AppSettings, 
  ConsoleLogMessage, 
  CaptionStyle, 
  WatermarkSettings, 
  AudioSettings 
} from './types';
import { DEFAULT_CAPTION_STYLE, PLATFORM_PRESETS } from './utils/constants';
import { getSetting, saveSetting } from './utils/indexedDb';
import { registerServiceWorker, setupPwaInstallListener } from './utils/pwaHelper';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('importer');
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoMetadata | null>(null);
  const [clips, setClips] = useState<ShortClipConfig[]>([]);

  // Settings & Modals
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    defaultQuality: 'high',
    preferredPlatform: 'youtube_shorts',
    autoProcessOnImport: false,
    enableHardwareAcceleration: true,
    maxConcurrentWorker: 2,
    watermarkDefaultText: 'reelsnip.com',
  });

  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(DEFAULT_CAPTION_STYLE);
  const [watermark, setWatermark] = useState<WatermarkSettings>({
    enabled: true,
    type: 'text',
    text: 'reelsnip.com',
    opacity: 0.7,
    position: 'bottom-right',
    scale: 1,
  });

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    muteOriginal: false,
    originalVolume: 1,
    backgroundMusicVolume: 0.2,
    voiceOverVolume: 1,
    fadeInDuration: 0.5,
    fadeOutDuration: 0.5,
  });

  const [logs, setLogs] = useState<ConsoleLogMessage[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Reelsnip AI Engine initialized. 100% Local Browser Mode active.',
    },
  ]);

  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState<unknown | null>(null);

  // Register PWA listeners on load
  useEffect(() => {
    registerServiceWorker();
    setupPwaInstallListener((prompt) => setPwaPrompt(prompt));
  }, []);

  const addLog = (message: string, type: ConsoleLogMessage['type'] = 'info') => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
      },
    ]);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.theme) saveSetting('theme', newSettings.theme);
      return updated;
    });
  };

  const handleAddVideo = (vid: VideoMetadata) => {
    setVideos((prev) => [vid, ...prev]);
    setActiveVideo(vid);
    addLog(`Imported video "${vid.name}" (${(vid.duration || 0).toFixed(1)}s, ${vid.width}x${vid.height})`, 'success');
  };

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideo?.id === id) {
      setActiveVideo(videos.find((v) => v.id !== id) || null);
    }
    addLog('Removed video from workspace', 'info');
  };

  const handleGenerateClips = (newClips: ShortClipConfig[]) => {
    setClips((prev) => [...newClips, ...prev]);
    addLog(`Added ${newClips.length} generated short clips to export queue`, 'success');
  };

  const handleUpdateClipStatus = (
    clipId: string,
    status: ShortClipConfig['status'],
    progress: number,
    blob?: Blob,
    error?: string
  ) => {
    setClips((prev) =>
      prev.map((c) => {
        if (c.id === clipId) {
          return {
            ...c,
            status,
            progress,
            resultBlob: blob || c.resultBlob,
            error: error || c.error,
          };
        }
        return c;
      })
    );
  };

  const handleInstallPwa = () => {
    if (pwaPrompt && typeof (pwaPrompt as { prompt: () => void }).prompt === 'function') {
      (pwaPrompt as { prompt: () => void }).prompt();
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans`}>
      {/* Top Header Navigation */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenPlatformModal={() => setIsPlatformModalOpen(true)}
        pwaPrompt={pwaPrompt}
        onInstallPwa={handleInstallPwa}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-0">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          videoCount={videos.length}
          clipCount={clips.length}
          queueCount={clips.filter((c) => c.status === 'queued').length}
        />

        {/* Tab Content Viewport */}
        <main className="flex-1 p-4 md:p-6 bg-slate-950/40 min-w-0">
          {activeTab === 'importer' && (
            <VideoImporter
              videos={videos}
              activeVideo={activeVideo}
              onAddVideo={handleAddVideo}
              onSelectVideo={(v) => setActiveVideo(v)}
              onRemoveVideo={handleRemoveVideo}
              onGoToAutoShorts={() => setActiveTab('auto')}
            />
          )}

          {activeTab === 'auto' && (
            <AutoShortsGenerator
              activeVideo={activeVideo}
              onGenerateClips={handleGenerateClips}
              onGoToQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'smart' && (
            <SmartDetectorView
              activeVideo={activeVideo}
              onAddShortClip={(clip) => setClips((prev) => [clip, ...prev])}
              onGoToQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'tools' && (
            <VideoToolsSuite
              activeVideo={activeVideo}
              onAddShortClip={(clip) => setClips((prev) => [clip, ...prev])}
              onGoToQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'seo' && (
            <AISeoGenerator
              activeVideo={activeVideo}
              clips={clips}
            />
          )}

          {activeTab === 'editor' && (
            <VideoEditorCanvas
              activeVideo={activeVideo}
              onSaveClip={(clip) => setClips((prev) => [clip, ...prev])}
              onGoToQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'captions' && (
            <CaptionEditor
              captions={clips[0]?.captions || []}
              captionStyle={captionStyle}
              watermark={watermark}
              onUpdateCaptions={(newCaps) => {
                setClips((prev) =>
                  prev.map((c, i) => (i === 0 ? { ...c, captions: newCaps } : c))
                );
              }}
              onUpdateCaptionStyle={setCaptionStyle}
              onUpdateWatermark={setWatermark}
            />
          )}

          {activeTab === 'audio' && (
            <AudioVoiceOver
              activeVideo={activeVideo}
              audioSettings={audioSettings}
              onUpdateAudioSettings={setAudioSettings}
            />
          )}

          {activeTab === 'queue' && (
            <ExportQueue
              clips={clips}
              videos={videos}
              logs={logs}
              onUpdateClipStatus={handleUpdateClipStatus}
              onClearQueue={() => setClips([])}
              onRemoveClip={(id) => setClips((prev) => prev.filter((c) => c.id !== id))}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'logs' && (
            <ConsoleLogsSettings
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              logs={logs}
              onClearLogs={() => setLogs([])}
            />
          )}
        </main>
      </div>

      {/* Target Platform Selector Drawer */}
      <PlatformPresetsModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
        selectedPlatformId={settings.preferredPlatform}
        onSelectPlatform={(pid) => handleUpdateSettings({ preferredPlatform: pid })}
      />
    </div>
  );
}
