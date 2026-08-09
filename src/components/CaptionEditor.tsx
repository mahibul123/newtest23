import React, { useState } from 'react';
import { 
  MessageSquare, 
  Type, 
  Palette, 
  Sparkles, 
  Plus, 
  Trash2, 
  Smile, 
  Check, 
  Layers,
  Sliders
} from 'lucide-react';
import { CaptionLine, CaptionStyle, WatermarkSettings } from '../types';
import { DEFAULT_CAPTION_STYLE } from '../utils/constants';

interface CaptionEditorProps {
  captions: CaptionLine[];
  captionStyle: CaptionStyle;
  watermark: WatermarkSettings;
  onUpdateCaptions: (captions: CaptionLine[]) => void;
  onUpdateCaptionStyle: (style: CaptionStyle) => void;
  onUpdateWatermark: (watermark: WatermarkSettings) => void;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
  captions,
  captionStyle,
  watermark,
  onUpdateCaptions,
  onUpdateCaptionStyle,
  onUpdateWatermark,
}) => {
  const [newText, setNewText] = useState('');
  const [newStart, setNewStart] = useState(1);
  const [newEnd, setNewEnd] = useState(5);

  const handleAddCaption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const words = newText.trim().split(' ').map((w, idx, arr) => {
      const step = (newEnd - newStart) / arr.length;
      return {
        text: w,
        start: newStart + idx * step,
        end: newStart + (idx + 1) * step,
      };
    });

    const newLine: CaptionLine = {
      id: `cap-${Date.now()}`,
      start: newStart,
      end: newEnd,
      text: newText.trim(),
      words,
    };

    onUpdateCaptions([...captions, newLine]);
    setNewText('');
  };

  const handleRemoveCaption = (id: string) => {
    onUpdateCaptions(captions.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          Auto Captions, Subtitles & Watermark Editor
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize viral karaoke subtitles, font styles, colors, highlights, and custom watermarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Caption Text List & Generator */}
        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-400" />
            Subtitle Lines ({captions.length})
          </h3>

          {/* Add Caption Form */}
          <form onSubmit={handleAddCaption} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Subtitle Line Text (Supports Emojis 🔥)
              </label>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="e.g. THIS WILL CHANGE YOUR LIFE 🔥"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block">Start Time (sec)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newStart}
                  onChange={(e) => setNewStart(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">End Time (sec)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newEnd}
                  onChange={(e) => setNewEnd(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subtitle Line
            </button>
          </form>

          {/* Caption List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {captions.map((cap) => (
              <div
                key={cap.id}
                className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-purple-300">{cap.text}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {cap.start}s - {cap.end}s
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveCaption(cap.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Caption Styling & Watermark Controls */}
        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            Viral Style & Watermark Settings
          </h3>

          {/* Font Family */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Typography Font
            </label>
            <select
              value={captionStyle.fontFamily}
              onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, fontFamily: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Bebas Neue, sans-serif">Bebas Neue (Bold Display - Recommended)</option>
              <option value="Montserrat, sans-serif">Montserrat Black</option>
              <option value="Poppins, sans-serif">Poppins Bold</option>
              <option value="Inter, sans-serif">Inter SemiBold</option>
            </select>
          </div>

          {/* Font Size & Position Y */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Font Size ({captionStyle.fontSize}px)
              </label>
              <input
                type="range"
                min={18}
                max={60}
                value={captionStyle.fontSize}
                onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, fontSize: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Vertical Position Y ({captionStyle.positionY}%)
              </label>
              <input
                type="range"
                min={20}
                max={95}
                value={captionStyle.positionY}
                onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, positionY: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Text Color</label>
              <input
                type="color"
                value={captionStyle.textColor}
                onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, textColor: e.target.value })}
                className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Highlight Gold</label>
              <input
                type="color"
                value={captionStyle.highlightColor}
                onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, highlightColor: e.target.value })}
                className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Stroke Color</label>
              <input
                type="color"
                value={captionStyle.strokeColor}
                onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, strokeColor: e.target.value })}
                className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Watermark Toggle & Settings */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={watermark.enabled}
                onChange={(e) => onUpdateWatermark({ ...watermark, enabled: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
              />
              <span>Enable Custom Watermark / Logo</span>
            </label>

            {watermark.enabled && (
              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={watermark.text}
                    onChange={(e) => onUpdateWatermark({ ...watermark, text: e.target.value })}
                    placeholder="e.g. reelsnip.com"
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Position</label>
                    <select
                      value={watermark.position}
                      onChange={(e) => onUpdateWatermark({ ...watermark, position: e.target.value as WatermarkSettings['position'] })}
                      className="w-full px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Opacity ({Math.round(watermark.opacity * 100)}%)</label>
                    <input
                      type="range"
                      min={0.2}
                      max={1}
                      step={0.1}
                      value={watermark.opacity}
                      onChange={(e) => onUpdateWatermark({ ...watermark, opacity: Number(e.target.value) })}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
