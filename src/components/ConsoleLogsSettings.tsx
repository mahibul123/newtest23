import React from 'react';
import { Terminal, Sliders, HardDrive, Cpu, ShieldCheck, Key, Trash2 } from 'lucide-react';
import { AppSettings, ConsoleLogMessage } from '../types';

interface ConsoleLogsSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  logs: ConsoleLogMessage[];
  onClearLogs: () => void;
}

export const ConsoleLogsSettings: React.FC<ConsoleLogsSettingsProps> = ({
  settings,
  onUpdateSettings,
  logs,
  onClearLogs,
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-purple-400" />
          Settings & Execution Logs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure local device preferences, hardware acceleration, and inspect live processing diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: User Settings */}
        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Device & Engine Settings
          </h3>

          <div className="space-y-4 text-xs">
            {/* Quality Preset */}
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">
                Default Export Quality
              </label>
              <select
                value={settings.defaultQuality}
                onChange={(e) => onUpdateSettings({ defaultQuality: e.target.value as AppSettings['defaultQuality'] })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="ultra">Ultra (Max Quality - 20 Mbps)</option>
                <option value="high">High (Recommended - 10 Mbps)</option>
                <option value="medium">Medium (Balanced - 6 Mbps)</option>
                <option value="low">Low (Fast & Compact - 3 Mbps)</option>
              </select>
            </div>

            {/* Default Watermark */}
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">
                Default Watermark Text
              </label>
              <input
                type="text"
                value={settings.watermarkDefaultText}
                onChange={(e) => onUpdateSettings({ watermarkDefaultText: e.target.value })}
                placeholder="reelsnip.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Hardware Acceleration Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
                <input
                  type="checkbox"
                  checked={settings.enableHardwareAcceleration}
                  onChange={(e) => onUpdateSettings({ enableHardwareAcceleration: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Enable Browser GPU & WebCodecs Acceleration</span>
              </label>
              <p className="text-[10px] text-slate-500 mt-1 pl-6">
                Uses hardware video encoder chips when supported by Chrome/Edge/Firefox.
              </p>
            </div>

            {/* Offline Privacy Card */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-emerald-300">
              <span className="font-bold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Offline Local Device Privacy
              </span>
              <p className="text-[11px] text-slate-400">
                All video rendering happens locally on your computer/phone. No videos or data are ever uploaded to external servers.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Full Console Terminal */}
        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                System Diagnostics & Logs
              </h3>
              <button
                onClick={onClearLogs}
                className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start gap-2 text-slate-400">
                  <span className="text-slate-600 select-none">[{l.timestamp}]</span>
                  <span
                    className={
                      l.type === 'error'
                        ? 'text-red-400'
                        : l.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }
                  >
                    {l.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Browser Web Workers: Active</span>
            <a href="https://reelsnip.com" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">
              reelsnip.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
