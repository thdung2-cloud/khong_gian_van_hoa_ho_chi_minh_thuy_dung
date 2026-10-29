import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Presentation,
  PlusCircle,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  LogOut,
  FolderOpen,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import {
  googleSignIn,
  logout,
  initAuth,
  getAccessToken,
} from '../utils/auth';
import {
  listUserPresentations,
  createPresentationFromTemplate,
  SLIDE_TEMPLATES,
  GoogleDriveFile,
  SlideTemplateOption,
} from '../utils/slidesApi';
import { soundCtrl } from '../utils/audio';

interface SlidesCenterProps {
  onBackTo3D: () => void;
}

export const SlidesCenter: React.FC<SlidesCenterProps> = ({ onBackTo3D }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'templates' | 'my_slides' | 'viewer'>('templates');
  const [presentations, setPresentations] = useState<GoogleDriveFile[]>([]);
  const [selectedPres, setSelectedPres] = useState<GoogleDriveFile | null>(null);

  // Template creation dialog state
  const [confirmTemplate, setConfirmTemplate] = useState<SlideTemplateOption | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<{ id: string; title: string; link: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadPresentations(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadPresentations = async (accessToken?: string) => {
    const currentToken = accessToken || token || (await getAccessToken());
    if (!currentToken) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const files = await listUserPresentations(currentToken);
      setPresentations(files);
      if (files.length > 0 && !selectedPres) {
        setSelectedPres(files[0]);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải slides:', err);
      setErrorMessage(err.message || 'Không thể tải danh sách bài thuyết trình từ Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        soundCtrl.playChime();
        await loadPresentations(res.accessToken);
      }
    } catch (err: any) {
      console.error('Đăng nhập thất bại:', err);
      setErrorMessage('Đăng nhập Google không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    soundCtrl.playChime(450);
    await logout();
    setUser(null);
    setToken(null);
    setPresentations([]);
    setSelectedPres(null);
  };

  // Explicit confirmation before creating presentation in user's Drive
  const handleConfirmCreate = async () => {
    if (!confirmTemplate) return;
    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      setErrorMessage('Vui lòng đăng nhập lại để tiếp tục.');
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);
    try {
      soundCtrl.playChime(600);
      const result = await createPresentationFromTemplate(confirmTemplate.id, currentToken);
      soundCtrl.playCorrect();
      setCreationSuccess({
        id: result.id,
        title: result.title,
        link: result.webViewLink,
      });
      setConfirmTemplate(null);
      // Reload user presentations
      await loadPresentations(currentToken);
    } catch (err: any) {
      console.error('Lỗi tạo presentation:', err);
      setErrorMessage(err.message || 'Không thể tạo bài thuyết trình trên Google Slides.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen font-['Be_Vietnam_Pro',sans-serif]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold w-fit mx-auto md:mx-0">
            <Presentation className="w-3.5 h-3.5 text-yellow-300" />
            <span>Tích hợp Google Slides &amp; Google Drive</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Nunito']">
            Bài Giảng &amp; Thuyết Trình Google Slides
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl font-medium">
            Tạo bài thuyết trình về Bác Hồ trực tiếp lên Google Slides, trình chiếu bài giảng mẫu trong tiết học và đồng bộ với Google Drive của thầy cô, học sinh.
          </p>
        </div>

        <button
          onClick={onBackTo3D}
          className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm shadow-md transition-all shrink-0"
        >
          Trở về Không Gian 3D 🏛️
        </button>
      </div>

      {/* Auth state check */}
      {!user ? (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 sm:p-12 text-center shadow-lg max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
            📊
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-['Nunito']">
              Kết Nối Google Slides Của Bạn
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              Đăng nhập tài khoản Google để tạo bài giảng mẫu về Bác Hồ, đồng bộ tài liệu thuyết trình vào Google Drive và trình chiếu trực tiếp trong lớp học.
            </p>
          </div>

          {/* Official Google Sign-In Button */}
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{isLoggingIn ? 'Đang kết nối Google...' : 'Đăng nhập với Google'}</span>
          </button>

          {errorMessage && (
            <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-200">
              {errorMessage}
            </p>
          )}
        </div>
      ) : (
        /* Logged in Workspace Dashboard */
        <div className="flex flex-col gap-6">
          {/* User Bar */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-10 h-10 rounded-full border border-amber-400" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-sm font-extrabold text-amber-950">
                  {user.displayName || 'Tài khoản Google'}
                </h4>
                <p className="text-xs text-stone-500 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadPresentations()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-all"
                title="Làm mới danh sách"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-700 text-xs font-bold border border-stone-200 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'templates'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Tạo Bài Giảng Mẫu Lên Google Slides</span>
            </button>

            <button
              onClick={() => setActiveTab('my_slides')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'my_slides'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span>Bài Thuyết Trình Của Tôi ({presentations.length})</span>
            </button>

            {selectedPres && (
              <button
                onClick={() => setActiveTab('viewer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'viewer'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
                }`}
              >
                <Play className="w-4 h-4 text-emerald-500" />
                <span>Trình Chiếu Nhúng</span>
              </button>
            )}
          </div>

          {/* Success Banner */}
          {creationSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-emerald-950">
                    Đã tạo thành công bài thuyết trình: "{creationSuccess.title}"
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Bài giảng đã được lưu vào Google Drive của bạn và sẵn sàng trình chiếu!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={creationSuccess.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  <span>Mở Google Slides</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    setSelectedPres({ id: creationSuccess.id, name: creationSuccess.title });
                    setActiveTab('viewer');
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-950 border border-emerald-300 text-xs font-bold hover:bg-emerald-100"
                >
                  Trình chiếu ngay
                </button>
              </div>
            </div>
          )}

          {/* Tab 1: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="flex flex-col gap-6">
              <div className="bg-amber-100/70 p-4 rounded-2xl border border-amber-300 text-xs sm:text-sm text-amber-950">
                <p className="font-semibold">
                  💡 <strong>Gợi ý:</strong> Chọn một trong các chủ đề dưới đây để ứng dụng tự động khởi tạo bộ Slide hoàn chỉnh trên Google Slides của bạn, phục vụ các buổi thuyết trình và tiết học lịch sử!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SLIDE_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="bg-white rounded-3xl border-2 border-amber-200 hover:border-red-500 p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mb-4">
                        {tmpl.icon}
                      </div>
                      <h3 className="text-base font-extrabold text-amber-950 mb-2 font-['Nunito']">
                        {tmpl.title}
                      </h3>
                      <p className="text-stone-600 text-xs leading-relaxed mb-4">
                        {tmpl.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                        <Layers className="w-4 h-4 text-red-500" />
                        <span>Quy mô: {tmpl.slidesCount} trang trình chiếu chuẩn</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundCtrl.playChime();
                        setConfirmTemplate(tmpl);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Tạo Vào Google Slides</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: MY SLIDES FROM DRIVE */}
          {activeTab === 'my_slides' && (
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-amber-200">
                  <p className="text-sm font-bold text-amber-950">Đang đồng bộ từ Google Drive...</p>
                </div>
              ) : presentations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {presentations.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 p-4 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                          <Presentation className="w-5 h-5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-amber-950 text-xs sm:text-sm truncate">
                            {file.name}
                          </h4>
                          {file.modifiedTime && (
                            <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(file.modifiedTime).toLocaleDateString('vi-VN')}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                        <button
                          onClick={() => {
                            setSelectedPres(file);
                            setActiveTab('viewer');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Trình chiếu</span>
                        </button>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-bold border border-stone-200"
                            title="Mở trong Google Slides"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-amber-200 flex flex-col items-center gap-3">
                  <p className="text-sm font-bold text-amber-950">Chưa có bài thuyết trình nào trên Google Drive của bạn.</p>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
                  >
                    Tạo bài giảng mẫu đầu tiên ngay!
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: EMBEDDED SLIDE VIEWER */}
          {activeTab === 'viewer' && selectedPres && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <Presentation className="w-5 h-5 text-amber-600" />
                  <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
                    Đang trình chiếu: {selectedPres.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://docs.google.com/presentation/d/${selectedPres.id}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold"
                  >
                    <span>Mở biên tập Google Slides</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Embedded Google Slides Player */}
              <div className="aspect-16/9 w-full bg-black rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl">
                <iframe
                  src={`https://docs.google.com/presentation/d/${selectedPres.id}/embed?start=false&loop=false&delayms=3000`}
                  title={selectedPres.name}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Mutating/Creating Files */}
      {confirmTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{confirmTemplate.icon}</span>
              <div>
                <h3 className="text-base font-extrabold text-amber-950 font-['Nunito']">
                  Xác Nhận Tạo Bài Thuyết Trình
                </h3>
                <p className="text-xs text-stone-500">Google Slides &amp; Google Drive</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              Bạn có muốn tạo bài thuyết trình <strong className="text-red-600">"{confirmTemplate.title}"</strong> ({confirmTemplate.slidesCount} trang slide chuẩn) vào tài khoản Google Drive của bạn không?
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              ℹ️ Thao tác này sẽ tạo một file Google Slides mới với nội dung bài học về Bác Hồ để bạn có thể biên tập và trình chiếu.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmTemplate(null)}
                disabled={isCreating}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmCreate}
                disabled={isCreating}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
              >
                {isCreating ? 'Đang tạo slides...' : 'Đồng ý & Tạo ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
