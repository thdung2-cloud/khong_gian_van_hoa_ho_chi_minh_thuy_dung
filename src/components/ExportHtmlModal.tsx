import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  Printer,
  Copy,
  Check,
  Globe,
  ExternalLink,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
  downloadStandaloneHtml,
  openHtmlPreview,
  generateStandaloneHtml,
} from '../utils/htmlExporter';
import { soundCtrl } from '../utils/audio';

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'options' | 'sourcePreview'>('options');

  if (!isOpen) return null;

  const handleDownload = () => {
    soundCtrl.playChime(650);
    downloadStandaloneHtml('Khong-Gian-Van-Hoa-Ho-Chi-Minh.html');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrintPreview = () => {
    soundCtrl.playChime(580);
    openHtmlPreview();
  };

  const handleCopySource = async () => {
    soundCtrl.playChime(700);
    const html = generateStandaloneHtml();
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-stone-900 border-2 border-amber-500 rounded-3xl shadow-2xl text-stone-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-900/90 via-stone-900 to-amber-950/80 border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <FileCode className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-amber-200 flex items-center gap-2">
                <span>Xuất Bản &amp; Tải File HTML</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full">
                  Offline Ready
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Lưu trữ toàn bộ Không Gian Văn Hóa Hồ Chí Minh dưới định dạng tệp HTML độc lập
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundCtrl.playChime(400);
              onClose();
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-800 bg-stone-950/50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('options')}
            className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'options'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Tùy chọn tải về &amp; In ấn</span>
          </button>
          <button
            onClick={() => setActiveTab('sourcePreview')}
            className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sourcePreview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Xem mã nguồn HTML</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'options' ? (
            <>
              {/* Main Download Option */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-stone-850 to-stone-900 border-2 border-amber-500/60 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5" />
                      Khuyên dùng cho Thầy Cô &amp; Học Sinh
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Tải File HTML Trọn Gói (.html)
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Chỉ với 1 file duy nhất nặng vài chục KB, chứa đầy đủ tất cả 4 khu trưng bày,
                      5 Điều Bác Hồ Dạy, lời tưởng niệm, và bộ 10 câu hỏi trắc nghiệm có đáp án.
                      Mở trực tiếp trên mọi máy tính, điện thoại, máy chiếu mà không cần internet!
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>Đã tải xuống!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Tải HTML ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action grid: Print/Preview & Copy Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Print to PDF / Open in new tab */}
                <div className="p-3.5 rounded-2xl bg-stone-850/80 border border-stone-700/80 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Xem Trước &amp; In / Xuất PDF</span>
                    </div>
                    <p className="text-xs text-stone-400 mb-3">
                      Mở bản HTML trong tab mới, đã được tối ưu định dạng trang in A4 chuẩn đẹp để in ra giấy hoặc lưu thành file PDF.
                    </p>
                  </div>
                  <button
                    onClick={handlePrintPreview}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs border border-stone-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở Xem Trước &amp; In Ấn</span>
                  </button>
                </div>

                {/* Copy Source Code */}
                <div className="p-3.5 rounded-2xl bg-stone-850/80 border border-stone-700/80 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                      <Copy className="w-4 h-4 text-amber-400" />
                      <span>Sao Chép Mã HTML</span>
                    </div>
                    <p className="text-xs text-stone-400 mb-3">
                      Sao chép toàn bộ mã nguồn HTML đã đóng gói sẵn CSS để dán vào website trường học, Google Sites, hay blog lớp.
                    </p>
                  </div>
                  <button
                    onClick={handleCopySource}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs border border-stone-600 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã chép vào bộ nhớ tạm!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Chép mã nguồn HTML</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Static Web App Dist info */}
              <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-stone-300 font-bold">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Bản Web App Tĩnh (Static Build) trong thư mục <code>/dist</code></span>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Ứng dụng 3D đã được biên dịch thành công sẵn trong thư mục <strong><code>/dist/index.html</code></strong>.
                  Quý thầy cô và quản trị viên có thể triển khai trực tiếp lên bất kỳ Web Server nào (GitHub Pages, Vercel, Netlify, Cloud Run hoặc máy chủ của nhà trường).
                </p>
              </div>

              {/* Features list in exported document */}
              <div className="p-3 rounded-2xl bg-stone-800/40 border border-stone-700/40">
                <h4 className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Nội dung tích hợp sẵn trong file HTML tải về:</span>
                </h4>
                <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                  <li>⭐ 5 Điều Bác Hồ Dạy Thiếu Niên Nhi Đồng (kèm diễn giải chi tiết)</li>
                  <li>🙏 Nghi lễ Bàn Thờ Bác Hồ &amp; Lời tưởng niệm dâng hoa sen</li>
                  <li>🌸 Khu 1: Bác Hồ với thiếu nhi &amp; học sinh (thư khai trường, thăm lớp học)</li>
                  <li>⛵ Khu 2: Hành trình bôn ba tìm đường cứu nước (Bến Nhà Rồng, anh Ba)</li>
                  <li>⭐ Khu 3: Lời dạy &amp; Tấm gương đạo đức Hồ Chí Minh</li>
                  <li>📜 Khu 4: Kỷ vật lịch sử, bản Tuyên ngôn Độc lập &amp; Di chúc thiêng liêng</li>
                  <li>📝 Bộ 10 câu hỏi đố vui trắc nghiệm lịch sử kèm đáp án và lời giải</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Mã nguồn HTML độc lập (đã đóng gói nhúng CSS tự động):</span>
                <button
                  onClick={handleCopySource}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-amber-100/90 overflow-x-auto max-h-96 select-all">
                {generateStandaloneHtml().slice(0, 3500)}
                {'\n\n... (Còn tiếp toàn bộ nội dung 4 khu trưng bày & bộ trắc nghiệm) ...'}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Mở file .html bằng bất kỳ trình duyệt nào: Chrome, Cốc Cốc, Edge, Safari...</span>
          </div>
          <button
            onClick={() => {
              soundCtrl.playChime(400);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
