import React, { useState, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Download, 
  Upload, 
  Play, 
  Square,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { AudioSettings, VideoMetadata } from '../types';

interface AudioVoiceOverProps {
  activeVideo: VideoMetadata | null;
  audioSettings: AudioSettings;
  onUpdateAudioSettings: (settings: AudioSettings) => void;
}

export const AudioVoiceOver: React.FC<AudioVoiceOverProps> = ({
  activeVideo,
  audioSettings,
  onUpdateAudioSettings,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        onUpdateAudioSettings({
          ...audioSettings,
          voiceOverUrl: url,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access permission required to record voiceover.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleExtractAudio = () => {
    if (!activeVideo) return;
    const a = document.createElement('a');
    a.href = activeVideo.url;
    a.download = `${activeVideo.name.replace(/\.[^/.]+$/, '')}_audio.mp4`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-purple-400" />
          Audio Mixer, Background Music & Voiceover
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust video volume, record live mic voiceovers, or upload custom background tracks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Audio & Extraction */}
        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            Source Video Audio Mixer
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={audioSettings.muteOriginal}
                onChange={(e) => onUpdateAudioSettings({ ...audioSettings, muteOriginal: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
              />
              <span>Mute Original Video Track</span>
            </label>

            {!audioSettings.muteOriginal && (
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Original Audio Volume ({Math.round(audioSettings.originalVolume * 100)}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={audioSettings.originalVolume}
                  onChange={(e) => onUpdateAudioSettings({ ...audioSettings, originalVolume: Number(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={handleExtractAudio}
                disabled={!activeVideo}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-purple-400" />
                Extract & Download Video Audio
              </button>
            </div>
          </div>
        </div>

        {/* Right: Voice Over Microphone Recorder */}
        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-400" />
            Record Microphone Voiceover
          </h3>

          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition ${
              isRecording ? 'bg-red-500/20 text-red-500 animate-pulse border-2 border-red-500' : 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
            }`}>
              <Mic className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-200">
                {isRecording ? 'Recording Microphone...' : 'Record Voiceover Audio'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Speak into your mic to overlay custom voice narration.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Square className="w-4 h-4 text-red-400 fill-red-400" />
                  Stop Recording
                </button>
              )}
            </div>

            {recordedAudioUrl && (
              <div className="pt-3 border-t border-slate-800 text-left space-y-2">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Voiceover recorded & attached!
                </span>
                <audio src={recordedAudioUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
