import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Volume2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { EXHIBIT_ITEMS, EXHIBIT_CATEGORIES, ExhibitItem } from '../data/exhibits';
import { soundCtrl } from '../utils/audio';

interface GalleryViewProps {
  onSelectExhibit: (exhibit: ExhibitItem) => void;
  onBackTo3D: () => void;
  onOpenExportHtml?: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  onSelectExhibit,
  onBackTo3D,
  onOpenExportHtml,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = EXHIBIT_ITEMS.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.quote && item.quote.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold w-fit mx-auto md:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Thư Viện Tranh Ảnh &amp; Infographic Lịch Sử</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Nunito']">
            Kho Tư Liệu Không Gian Văn Hóa Hồ Chí Minh
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl font-medium">
            Nơi lưu giữ các hình ảnh, câu chuyện, lời dạy thiêng liêng và kỷ vật giản dị của Bác Hồ được biên soạn phù hợp với các em thiếu niên, nhi đồng.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onOpenExportHtml && (
            <button
              onClick={() => {
                soundCtrl.playChime(620);
                onOpenExportHtml();
              }}
              className="px-5 py-3 rounded-2xl bg-stone-900/80 hover:bg-stone-900 text-amber-300 font-bold text-sm border border-amber-400/60 shadow-md transition-all flex items-center gap-2"
            >
              <span>📄</span>
              <span>Xuất HTML Offline</span>
            </button>
          )}

          <button
            onClick={onBackTo3D}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm shadow-md transition-all shrink-0"
          >
            Trở về Không Gian 3D 🏛️
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {EXHIBIT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundCtrl.playChime(550);
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tranh, lời dạy, chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border-2 border-amber-200 bg-white text-xs sm:text-sm text-amber-950 font-medium focus:outline-none focus:border-red-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Exhibit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              soundCtrl.playChime();
              onSelectExhibit(item);
            }}
            className="group cursor-pointer bg-white rounded-3xl border-2 border-amber-200 hover:border-red-500 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image Preview */}
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600/90 text-white backdrop-blur-xs">
                {item.categoryName}
              </span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-white/90 text-amber-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                  <Eye className="w-4 h-4 text-red-600" />
                  <span>Xem chi tiết</span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-amber-950 text-sm sm:text-base group-hover:text-red-600 transition-colors line-clamp-2 mb-2 font-['Nunito']">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed mb-3">
                  {item.shortDesc}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Khu vực {item.zone}</span>
                </span>
                <span className="text-red-600 font-extrabold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Khám phá</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-amber-300">
          <p className="text-amber-900 font-bold text-base">
            Không tìm thấy tư liệu phù hợp với từ khóa "{searchTerm}"
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-200 text-amber-950 text-xs font-bold"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
};
