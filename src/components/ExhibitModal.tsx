import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Quote,
  Lightbulb,
} from 'lucide-react';
import { ExhibitItem, EXHIBIT_ITEMS } from '../data/exhibits';
import { soundCtrl } from '../utils/audio';

interface ExhibitModalProps {
  exhibit: ExhibitItem | null;
  onClose: () => void;
  onSelectExhibit: (exhibit: ExhibitItem) => void;
}

export const ExhibitModal: React.FC<ExhibitModalProps> = ({
  exhibit,
  onClose,
  onSelectExhibit,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Stop reading when exhibit changes or modal closes
    soundCtrl.stopSpeaking();
    setIsSpeaking(false);
  }, [exhibit]);

  if (!exhibit) return null;

  const currentIndex = EXHIBIT_ITEMS.findIndex((item) => item.id === exhibit.id);
  const prevExhibit = EXHIBIT_ITEMS[(currentIndex - 1 + EXHIBIT_ITEMS.length) % EXHIBIT_ITEMS.length];
  const nextExhibit = EXHIBIT_ITEMS[(currentIndex + 1) % EXHIBIT_ITEMS.length];

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      soundCtrl.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${exhibit.title}. ${exhibit.shortDesc}. ${exhibit.fullStory}. Bé có biết: ${exhibit.funFact}`;
      soundCtrl.speakText(textToRead, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200 bg-amber-100/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                {exhibit.categoryName}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 mt-1 font-['Nunito']">
                {exhibit.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeak}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                isSpeaking
                  ? 'bg-red-500 text-white hover:bg-red-600 ring-2 ring-red-300'
                  : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
              }`}
              title={isSpeaking ? 'Dừng đọc' : 'Đọc bài cho bé nghe'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Dừng đọc' : 'Bé nghe đọc 🔊'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-amber-200/80 hover:bg-red-500 hover:text-white text-amber-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image showcase */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative group w-full rounded-2xl overflow-hidden border-4 border-amber-400/80 shadow-lg bg-amber-900/5">
              <img
                src={exhibit.image}
                alt={exhibit.title}
                className="w-full h-auto max-h-[380px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-center">
                <span className="text-white text-xs font-semibold drop-shadow">
                  Tư liệu trưng bày chính thức
                </span>
              </div>
            </div>

            {/* Quick quote box if available */}
            {exhibit.quote && (
              <div className="mt-4 w-full bg-amber-100/90 border border-amber-300 rounded-2xl p-4 relative shadow-sm">
                <Quote className="w-5 h-5 text-amber-600 absolute top-2 left-2 opacity-50" />
                <p className="text-xs sm:text-sm italic font-bold text-amber-950 pl-4 text-center">
                  "{exhibit.quote}"
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Story & Kids Educational details */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Overview pill */}
            <div className="bg-white/80 rounded-2xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>Nội dung giới thiệu</span>
              </div>
              <p className="text-amber-900 text-sm font-semibold leading-relaxed">
                {exhibit.shortDesc}
              </p>
            </div>

            {/* Full Story */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm">
              <h3 className="text-sm font-extrabold text-amber-950 mb-2 flex items-center gap-2">
                <span>📖</span> Câu chuyện lịch sử
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                {exhibit.fullStory}
              </p>
            </div>

            {/* Fun Fact for Kids */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-100 rounded-2xl p-4 border-2 border-dashed border-amber-400 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-1.5">
                <Lightbulb className="w-4 h-4 text-yellow-600 fill-yellow-500" />
                <span>Góc khám phá thú vị dành cho bé!</span>
              </div>
              <p className="text-amber-950 text-xs sm:text-sm font-semibold">
                {exhibit.funFact}
              </p>
            </div>

            {/* Kids pledge takeaway */}
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-3 text-red-900 text-xs sm:text-sm">
              <Sparkles className="w-5 h-5 text-red-500 shrink-0" />
              <p className="font-medium">
                <strong>Bé học được gì:</strong> Luôn chăm chỉ, yêu thương bạn bè và nhớ ơn công lao vĩ đại của Bác Hồ!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-amber-200 bg-amber-100/50 rounded-b-2xl">
          <button
            onClick={() => {
              soundCtrl.playChime();
              onSelectExhibit(prevExhibit);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Hiện vật trước</span>
          </button>

          <span className="text-xs font-bold text-amber-800">
            {currentIndex + 1} / {EXHIBIT_ITEMS.length}
          </span>

          <button
            onClick={() => {
              soundCtrl.playChime();
              onSelectExhibit(nextExhibit);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <span>Hiện vật tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
