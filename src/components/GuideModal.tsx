import React from 'react';
import { X, Compass, MousePointer, Volume2, Gamepad2, Heart, Sparkles } from 'lucide-react';
import { soundCtrl } from '../utils/audio';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onStartTour,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 bg-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🧭</span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 font-['Nunito']">
                Hướng Dẫn Tham Quan Không Gian 3D
              </h2>
              <p className="text-xs text-amber-800 font-semibold">
                Dành cho các bạn nhỏ học sinh tiểu học
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-amber-200 hover:bg-red-500 hover:text-white text-amber-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Item 1: 3D Movement */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <MousePointer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Xoay và ngắm nhìn không gian 360°
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Nhấn giữ chuột trái (hoặc vuốt ngón tay trên màn hình điện thoại) để xoay nhìn toàn bộ phòng truyền thống. Cuộn chuột để phóng to hoặc thu nhỏ.
              </p>
            </div>
          </div>

          {/* Item 2: Click to inspect */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Nhấp chuột vào tranh và hiện vật
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Mỗi giá trưng bày trong phòng 3D đều có thể nhấn vào để xem tranh kích thước lớn, đọc câu chuyện lịch sử và khám phá góc "Bé có biết?".
              </p>
            </div>
          </div>

          {/* Item 3: Audio TTS */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Nghe giọng đọc ấm áp tiếng Việt
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Khi mở từng hiện vật, các bé có thể bấm nút <strong className="text-red-600">"Bé nghe đọc 🔊"</strong> để lắng nghe câu chuyện kể về Bác Hồ kính yêu.
              </p>
            </div>
          </div>

          {/* Item 4: Interactive Games */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Trò chơi đố vui &amp; thử thách thiếu nhi
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Tham gia trả lời 8 câu hỏi đố vui để nhận huy hiệu "Cháu Ngoan Bác Hồ", thử tài trí nhớ với trò chơi ghép thẻ kỷ vật và ghép đúng 5 Điều Bác Hồ Dạy.
              </p>
            </div>
          </div>

          {/* Item 5: Flower Offering */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">
                Góc dâng hoa &amp; gửi lời hứa cháu ngoan
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Bé có thể tự tay chọn đóa sen tươi thắm, viết lời hứa chăm ngoan học giỏi để dâng lên bàn thờ Bác trong không gian 3D.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-200 bg-amber-50 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              soundCtrl.playChime();
              onClose();
              onStartTour();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Bắt đầu khám phá ngay!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
