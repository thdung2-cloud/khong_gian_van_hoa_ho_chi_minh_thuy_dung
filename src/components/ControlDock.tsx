import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Compass,
  Maximize2,
  Minimize2,
  HelpCircle,
  Eye,
  Gamepad2,
  Heart,
  FileCode,
} from 'lucide-react';
import { CameraPreset } from './ThreeScene';
import { soundCtrl } from '../utils/audio';

interface ControlDockProps {
  activePreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  onOpenGames: (tab?: 'quiz' | 'memory' | 'teachings' | 'flower') => void;
  onOpenGuide: () => void;
  onOpenExportHtml?: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  activePreset,
  onSelectPreset,
  onOpenGames,
  onOpenGuide,
  onOpenExportHtml,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleBgm = () => {
    soundCtrl.playChime();
    const state = soundCtrl.toggleBgm();
    setIsBgmOn(state);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const presets: { id: CameraPreset; label: string; icon: string }[] = [
    { id: 'overview', label: 'Toàn cảnh', icon: '🌐' },
    { id: 'altar', label: 'Bàn thờ Bác', icon: '🙏' },
    { id: 'zone1', label: 'Khu Thiếu nhi', icon: '🌸' },
    { id: 'zone2', label: 'Khu Hành trình', icon: '⛵' },
    { id: 'zone3', label: 'Khu Lời dạy', icon: '⭐' },
    { id: 'zone4', label: 'Khu Hiện vật', icon: '📜' },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[96vw] max-w-[920px] pointer-events-none flex flex-col items-center select-none transition-transform duration-300">
      {/* Collapse/Expand Toggle Tab */}
      <button
        onClick={() => {
          soundCtrl.playChime(500);
          setIsCollapsed(!isCollapsed);
        }}
        className="pointer-events-auto mb-1.5 flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-900/90 hover:bg-amber-950 text-amber-200 border border-amber-500/50 text-xs font-bold shadow-lg transition-all"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Mở bảng điều khiển 3D</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Thu gọn để ngắm 3D</span>
          </>
        )}
      </button>

      {/* Main Bottom Dock Panel */}
      <div
        className={`pointer-events-auto w-full bg-stone-900/90 border-2 border-amber-500/70 rounded-3xl p-2.5 sm:p-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300 ${
          isCollapsed ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Left: Camera Viewpoint Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1 pl-1 pr-2 hidden md:flex">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Góc nhìn:</span>
          </span>

          {presets.map((p) => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundCtrl.playChime(550);
                  onSelectPreset(p.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                    : 'bg-stone-800/90 text-amber-100 hover:bg-stone-700 hover:text-white border border-stone-700'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick actions & sound controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Quick flower offering */}
          <button
            onClick={() => onOpenGames('flower')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-sm transition-all"
            title="Dâng hoa sen lên Bác"
          >
            <Heart className="w-3.5 h-3.5 text-pink-200" />
            <span className="hidden sm:inline">Dâng hoa</span>
          </button>

          {/* Quick game button */}
          <button
            onClick={() => onOpenGames('quiz')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all"
            title="Trò chơi đố vui"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đố vui</span>
          </button>

          {/* Quick Export HTML button */}
          <button
            onClick={() => {
              soundCtrl.playChime(620);
              onOpenExportHtml?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold text-xs shadow-sm transition-all"
            title="Xuất file HTML tự chạy & in ấn"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Xuất HTML</span>
          </button>

          {/* Background Music toggle */}
          <button
            onClick={handleToggleBgm}
            className={`p-2 rounded-xl text-xs font-bold transition-all border ${
              isBgmOn
                ? 'bg-amber-400 text-stone-950 border-amber-300'
                : 'bg-stone-800 text-amber-200 border-stone-700 hover:bg-stone-700'
            }`}
            title={isBgmOn ? 'Tắt nhạc nền' : 'Bật nhạc nền dân tộc du dương'}
          >
            {isBgmOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Help Guide */}
          <button
            onClick={onOpenGuide}
            className="p-2 rounded-xl bg-stone-800 text-amber-200 hover:bg-stone-700 border border-stone-700 transition-all"
            title="Hướng dẫn điều khiển cho bé"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-stone-800 text-amber-200 hover:bg-stone-700 border border-stone-700 transition-all hidden sm:flex"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
