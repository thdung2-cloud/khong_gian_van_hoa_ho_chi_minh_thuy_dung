import React, { useState } from 'react';
import { ThreeScene, CameraPreset } from './components/ThreeScene';
import { HeaderNav, ActiveAppView } from './components/HeaderNav';
import { ControlDock } from './components/ControlDock';
import { ExhibitModal } from './components/ExhibitModal';
import { GamesModal } from './components/GamesModal';
import { GalleryView } from './components/GalleryView';
import { GuideModal } from './components/GuideModal';
import { SlidesCenter } from './components/SlidesCenter';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import { ExhibitItem } from './data/exhibits';
import { soundCtrl } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('3d');
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitItem | null>(null);

  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [gamesInitialTab, setGamesInitialTab] = useState<'quiz' | 'memory' | 'teachings' | 'flower'>('quiz');

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExportHtmlOpen, setIsExportHtmlOpen] = useState(false);
  const [offeredFlowersCount, setOfferedFlowersCount] = useState(6); // Default flowers on altar

  const handleSelectExhibit = (exhibit: ExhibitItem) => {
    setSelectedExhibit(exhibit);
  };

  const handleOpenGames = (tab: 'quiz' | 'memory' | 'teachings' | 'flower' = 'quiz') => {
    soundCtrl.playChime();
    setGamesInitialTab(tab);
    setIsGamesOpen(true);
  };

  const handleFlowerOffered = () => {
    setOfferedFlowersCount((prev) => prev + 1);
  };

  const handleNavChange = (view: ActiveAppView) => {
    if (view === 'games') {
      handleOpenGames('quiz');
    } else if (view === 'guide') {
      setIsGuideOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-900 font-['Be_Vietnam_Pro',sans-serif]">
      {/* Top Header Navigation */}
      <HeaderNav
        currentView={currentView}
        onChangeView={handleNavChange}
        onOpenFlowerOffering={() => handleOpenGames('flower')}
        onOpenExportHtml={() => setIsExportHtmlOpen(true)}
        offeredCount={offeredFlowersCount}
      />

      {/* Main Content Area */}
      {currentView === '3d' && (
        <main className="w-full h-full relative">
          {/* 3D WebGL Canvas */}
          <ThreeScene
            onSelectExhibit={handleSelectExhibit}
            activePreset={activePreset}
            offeredFlowersCount={offeredFlowersCount}
          />

          {/* Minimal 3D Scene Floating Badge (Top Left, non-occluding) */}
          <div className="absolute top-20 left-4 sm:left-6 z-20 pointer-events-none select-none">
            <div className="bg-stone-900/80 backdrop-blur-xs border border-amber-500/50 rounded-2xl px-4 py-2.5 shadow-xl text-white max-w-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇻🇳</span>
                <div>
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Không Gian Văn Hóa
                  </h3>
                  <p className="text-[11px] text-stone-300 font-medium">
                    Nhấp vào các bảng trưng bày để khám phá câu chuyện
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Zone Jump Buttons (Top Right, minimal) */}
          <div className="absolute top-20 right-4 sm:right-6 z-20 pointer-events-auto flex flex-col gap-2 select-none">
            <button
              onClick={() => {
                soundCtrl.playChime();
                setActivePreset('altar');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs shadow-lg transition-all border border-red-400"
            >
              <span>🙏</span>
              <span className="hidden sm:inline">Viếng Bàn Thờ Bác</span>
            </button>
            <button
              onClick={() => {
                soundCtrl.playChime();
                setActivePreset('zone1');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-all border border-amber-300"
            >
              <span>🌸</span>
              <span className="hidden sm:inline">Khu Thiếu Nhi</span>
            </button>
          </div>

          {/* Unified Collapsible Bottom Control Dock */}
          <ControlDock
            activePreset={activePreset}
            onSelectPreset={(p) => setActivePreset(p)}
            onOpenGames={handleOpenGames}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenExportHtml={() => setIsExportHtmlOpen(true)}
          />
        </main>
      )}

      {currentView === 'gallery' && (
        <main className="w-full h-full overflow-y-auto bg-gradient-to-b from-stone-900 via-amber-950/20 to-stone-900">
          <GalleryView
            onSelectExhibit={handleSelectExhibit}
            onBackTo3D={() => setCurrentView('3d')}
            onOpenExportHtml={() => setIsExportHtmlOpen(true)}
          />
        </main>
      )}

      {currentView === 'slides' && (
        <main className="w-full h-full overflow-y-auto bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900">
          <SlidesCenter onBackTo3D={() => setCurrentView('3d')} />
        </main>
      )}

      {/* --- MODALS --- */}
      {/* Exhibit Detail Modal */}
      <ExhibitModal
        exhibit={selectedExhibit}
        onClose={() => setSelectedExhibit(null)}
        onSelectExhibit={handleSelectExhibit}
      />

      {/* History Games & Educational Activities Modal */}
      <GamesModal
        isOpen={isGamesOpen}
        onClose={() => setIsGamesOpen(false)}
        initialTab={gamesInitialTab}
        onFlowerOffered={handleFlowerOffered}
        offeredCount={offeredFlowersCount}
      />

      {/* Navigation Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartTour={() => setActivePreset('overview')}
      />

      {/* HTML Exporter Modal */}
      <ExportHtmlModal
        isOpen={isExportHtmlOpen}
        onClose={() => setIsExportHtmlOpen(false)}
      />
    </div>
  );
}
