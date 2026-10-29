import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Heart,
  Volume2,
  ArrowRight,
  Flame,
} from 'lucide-react';
import {
  QUIZ_QUESTIONS,
  MEMORY_CARDS_SOURCE,
  TEACHINGS_OF_BAC_HO,
  LOTUS_OFFERINGS,
  PRESET_PLEDGES,
  MemoryCard,
} from '../data/games';
import { soundCtrl } from '../utils/audio';

interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'quiz' | 'memory' | 'teachings' | 'flower';
  onFlowerOffered: (flowerColor: string, pledge: string) => void;
  offeredCount: number;
}

export const GamesModal: React.FC<GamesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'quiz',
  onFlowerOffered,
  offeredCount,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'memory' | 'teachings' | 'flower'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // --- QUIZ STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      soundCtrl.playCorrect();
      setScore((prev) => prev + 10);
    } else {
      soundCtrl.playTryAgain();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      soundCtrl.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // --- MEMORY MATCH STATE ---
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    MEMORY_CARDS_SOURCE.forEach((item, index) => {
      deck.push({ ...item, id: index * 2 });
      deck.push({ ...item, id: index * 2 + 1 });
    });
    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  useEffect(() => {
    if (activeTab === 'memory' && cards.length === 0) {
      initMemoryGame();
    }
  }, [activeTab]);

  const handleCardClick = (cardId: number, symbolId: string) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedPairs.includes(symbolId)) return;

    soundCtrl.playChime(600);
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards.find((c) => c.id === newFlipped[0]);
      const card2 = cards.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.symbolId === card2.symbolId) {
        soundCtrl.playCorrect();
        setMatchedPairs((prev) => [...prev, card1.symbolId]);
        setFlippedCards([]);

        // Check if finished
        if (matchedPairs.length + 1 === MEMORY_CARDS_SOURCE.length) {
          soundCtrl.playFanfare();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // --- 5 ĐIỀU BÁC HỒ DẠY STATE ---
  const [shuffledTeachings, setShuffledTeachings] = useState<number[]>([]);
  const [userOrderedTeachings, setUserOrderedTeachings] = useState<number[]>([]);
  const [teachingsFeedback, setTeachingsFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'teachings') {
      const order = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
      setShuffledTeachings(order);
      setUserOrderedTeachings([]);
      setTeachingsFeedback(null);
    }
  }, [activeTab]);

  const handlePickTeaching = (id: number) => {
    if (userOrderedTeachings.includes(id)) return;
    soundCtrl.playChime(500 + userOrderedTeachings.length * 80);
    const updated = [...userOrderedTeachings, id];
    setUserOrderedTeachings(updated);

    if (updated.length === 5) {
      const isPerfect = updated.every((item, idx) => item === idx + 1);
      if (isPerfect) {
        soundCtrl.playFanfare();
        setTeachingsFeedback('Tuyệt vời! Bé đã xếp đúng thứ tự 5 Điều Bác Hồ Dạy rồi đó! 🎉');
        confetti({ particleCount: 70, spread: 60 });
      } else {
        soundCtrl.playTryAgain();
        setTeachingsFeedback('Gần đúng rồi! Bé hãy nhấn "Làm lại" để sắp xếp chuẩn xác từ Điều 1 đến Điều 5 nhé! 💡');
      }
    }
  };

  const handleResetTeachings = () => {
    setUserOrderedTeachings([]);
    setTeachingsFeedback(null);
  };

  // --- GÓC DÂNG HOA STATE ---
  const [selectedLotus, setSelectedLotus] = useState('pink');
  const [selectedPledge, setSelectedPledge] = useState(PRESET_PLEDGES[0]);
  const [studentName, setStudentName] = useState('');
  const [flowerSubmitted, setFlowerSubmitted] = useState(false);

  const handleOfferFlower = () => {
    soundCtrl.playBell();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#f59e0b', '#ffffff'],
    });
    onFlowerOffered(selectedLotus, selectedPledge);
    setFlowerSubmitted(true);
    setTimeout(() => {
      setFlowerSubmitted(false);
    }, 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col">
        {/* Header with Game Selection Tabs */}
        <div className="px-6 py-4 border-b border-amber-200 bg-amber-100/90 rounded-t-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <div>
              <h2 className="text-xl font-extrabold text-amber-950 font-['Nunito']">
                Góc Học Tập & Trò Chơi Lịch Sử
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Vui học cùng Bác Hồ kính yêu dành cho thiếu nhi
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="self-end sm:self-auto p-2 rounded-full bg-amber-200 hover:bg-red-500 hover:text-white text-amber-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-amber-200 bg-amber-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Đố Vui Lịch Sử</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'memory'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ghép Tranh Kỷ Vật</span>
          </button>

          <button
            onClick={() => setActiveTab('teachings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'teachings'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>5 Điều Bác Hồ Dạy</span>
          </button>

          <button
            onClick={() => setActiveTab('flower')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'flower'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Heart className="w-4 h-4 text-pink-300" />
            <span>Góc Dâng Hoa ({offeredCount})</span>
          </button>
        </div>

        {/* Tab 1: QUIZ GAME */}
        {activeTab === 'quiz' && (
          <div className="p-6 flex flex-col gap-5">
            {!quizFinished ? (
              <>
                {/* Score & Progress banner */}
                <div className="flex items-center justify-between bg-amber-100/80 rounded-2xl p-3 border border-amber-300 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-extrabold text-amber-950">
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs">
                      Câu {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                    <span>Huy hiệu: {currentQ.badgeAward}</span>
                  </div>
                  <div className="flex items-center gap-2 font-extrabold text-amber-900">
                    <span>Điểm:</span>
                    <span className="px-3 py-1 bg-yellow-400 text-amber-950 rounded-full font-black text-sm">
                      {score} ⭐
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm">
                  <h3 className="text-base sm:text-lg font-extrabold text-amber-950 mb-4 leading-relaxed font-['Nunito']">
                    {currentQ.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      let btnStyle = 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200';

                      if (isSelected) {
                        btnStyle = 'bg-amber-200 border-amber-400 text-amber-950 ring-2 ring-amber-400 font-bold';
                      }

                      if (isAnswerSubmitted) {
                        if (idx === currentQ.correctAnswer) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                        } else if (isSelected && idx !== currentQ.correctAnswer) {
                          btnStyle = 'bg-red-100 border-red-500 text-red-950 font-bold';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all flex items-start gap-3 shadow-sm ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-white border border-amber-300 flex items-center justify-center font-bold text-xs text-amber-900 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Audio read button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => soundCtrl.speakText(`${currentQ.question}. Đáp án A: ${currentQ.options[0]}. Đáp án B: ${currentQ.options[1]}. Đáp án C: ${currentQ.options[2]}. Đáp án D: ${currentQ.options[3]}`)}
                      className="text-xs font-bold text-amber-700 hover:text-red-600 flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Đọc câu hỏi cho bé</span>
                    </button>
                  </div>
                </div>

                {/* Explanation card after submit */}
                {isAnswerSubmitted && (
                  <div
                    className={`rounded-2xl p-4 border-2 flex flex-col gap-2 animate-fade-in ${
                      selectedOption === currentQ.correctAnswer
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-orange-50 border-orange-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-extrabold text-sm">
                      {selectedOption === currentQ.correctAnswer ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Chính xác tuyệt đối! Giỏi lắm bé ơi! 🎉</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <span>Chưa chính xác rồi, đừng buồn nhé bé ơi! 💡</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium">{currentQ.explanation}</p>
                    <div className="text-xs font-semibold text-amber-800 bg-white/70 p-2 rounded-xl">
                      ⭐ <strong>Mẹo nhỏ:</strong> {currentQ.funTip}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleConfirmAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Kiểm tra kết quả</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <span>
                        {currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết ⭐'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Quiz Finished Screen
              <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border-2 border-amber-300 shadow-md">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-amber-950 font-['Nunito']">
                  Hoàn Thành Thử Thách Đố Vui!
                </h3>
                <p className="text-amber-800 text-sm mt-1">
                  Chúc mừng bé đã xuất sắc vượt qua các câu hỏi về Bác Hồ!
                </p>

                <div className="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center">
                  <span className="text-xs font-bold text-amber-700">Tổng điểm đạt được</span>
                  <span className="text-4xl font-black text-red-600 mt-1">{score} / {QUIZ_QUESTIONS.length * 10} ⭐</span>
                  <span className="mt-2 text-xs font-extrabold px-3 py-1 rounded-full bg-yellow-400 text-amber-950">
                    Danh hiệu: Cháu Ngoan Bác Hồ Xuất Sắc 🎖️
                  </span>
                </div>

                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại lần nữa</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: MEMORY CARD GAME */}
        {activeTab === 'memory' && (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-amber-100/70 rounded-2xl p-3 border border-amber-300 text-xs sm:text-sm">
              <span className="font-extrabold text-amber-950">
                Tìm các cặp hình kỷ vật giống nhau
              </span>
              <div className="flex items-center gap-3 font-bold text-amber-900">
                <span>Số lượt lật: {moves}</span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-600 text-white text-xs">
                  Đã ghép: {matchedPairs.length} / {MEMORY_CARDS_SOURCE.length}
                </span>
                <button
                  onClick={initMemoryGame}
                  className="p-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950"
                  title="Chơi lại"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 my-2">
              {cards.map((card) => {
                const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.symbolId);
                const isMatched = matchedPairs.includes(card.symbolId);

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id, card.symbolId)}
                    className={`aspect-square rounded-2xl cursor-pointer p-2 flex flex-col items-center justify-center text-center transition-all duration-300 transform select-none shadow-sm border-2 ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 opacity-90'
                        : isFlipped
                        ? 'bg-amber-100 border-amber-400 scale-102'
                        : 'bg-gradient-to-br from-red-600 to-amber-700 border-amber-300 hover:scale-103'
                    }`}
                  >
                    {isFlipped ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-3xl mb-1">{card.icon}</span>
                        <span className="text-xs font-bold text-amber-950 line-clamp-1">{card.name}</span>
                        {card.image && (
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-10 h-10 object-contain rounded-md mt-1 border border-amber-300 bg-white"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl text-amber-200">⭐</span>
                        <span className="text-[10px] font-extrabold text-amber-100 uppercase tracking-wider mt-1">
                          Lật mở
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {matchedPairs.length === MEMORY_CARDS_SOURCE.length && (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center">
                <span className="text-2xl">🎉</span>
                <h4 className="font-black text-emerald-950 text-base">Hoan hô bé đã tìm đủ tất cả các cặp kỷ vật!</h4>
                <p className="text-xs font-semibold text-emerald-800 mt-1">
                  Bé có trí nhớ thật tuyệt vời!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 5 ĐIỀU BÁC HỒ DẠY */}
        {activeTab === 'teachings' && (
          <div className="p-6 flex flex-col gap-4">
            <div className="bg-amber-100/90 rounded-2xl p-4 border border-amber-300">
              <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
                <span>🎖️</span> Bé Hãy Sắp Xếp Đúng 5 Điều Bác Hồ Dạy
              </h3>
              <p className="text-xs text-amber-900 mt-1">
                Nhấn lần lượt vào các câu bên dưới theo đúng thứ tự từ Điều 1 đến Điều 5 nhé!
              </p>
            </div>

            {/* Selected slots */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-900">Thứ tự bé đã chọn:</span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((slot) => {
                  const teachingId = userOrderedTeachings[slot - 1];
                  const item = TEACHINGS_OF_BAC_HO.find((t) => t.id === teachingId);

                  return (
                    <div
                      key={slot}
                      className={`min-h-[80px] rounded-2xl p-2.5 border-2 flex flex-col items-center justify-center text-center transition-all ${
                        item
                          ? 'bg-amber-100 border-amber-400 text-amber-950'
                          : 'bg-white/60 border-dashed border-amber-300 text-stone-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-red-600 mb-1">Điều {slot}</span>
                      {item ? (
                        <>
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-xs font-bold mt-1 line-clamp-2">{item.text}</span>
                        </>
                      ) : (
                        <span className="text-xs italic">Chờ chọn...</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available choices to pick */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-amber-900">Chọn câu tiếp theo:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shuffledTeachings.map((id) => {
                  const item = TEACHINGS_OF_BAC_HO.find((t) => t.id === id);
                  if (!item) return null;
                  const isUsed = userOrderedTeachings.includes(id);

                  return (
                    <button
                      key={id}
                      onClick={() => handlePickTeaching(id)}
                      disabled={isUsed}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
                        isUsed
                          ? 'bg-stone-100 border-stone-200 opacity-40 cursor-not-allowed text-stone-400'
                          : 'bg-white hover:bg-amber-100 border-amber-300 text-amber-950 shadow-sm font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs sm:text-sm font-bold">{item.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundCtrl.speakText(`Điều: ${item.text}. Ý nghĩa: ${item.meaning}`);
                        }}
                        className="p-1 rounded-lg hover:bg-amber-200 text-amber-800"
                        title="Nghe giải nghĩa"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Reset */}
            {teachingsFeedback && (
              <div className="p-3 rounded-2xl bg-amber-100 border-2 border-amber-300 text-xs sm:text-sm font-bold text-amber-950 text-center animate-fade-in">
                {teachingsFeedback}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleResetTeachings}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại từ đầu</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: GÓC DÂNG HOA & LỜI HỨA BÚP MĂNG XINH */}
        {activeTab === 'flower' && (
          <div className="p-6 flex flex-col gap-5">
            <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl p-4 border border-pink-200">
              <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
                <span className="text-pink-600">🪷</span> Dâng Hoa Tươi Thắm Lên Bác Hồ Kính Yêu
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                Các bạn nhỏ hãy chọn bông hoa sen tươi đẹp nhất và gửi gắm lời hứa chăm ngoan của mình lên bàn thờ Bác trong không gian 3D nhé!
              </p>
            </div>

            {/* Choose Flower Color */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-amber-950">1. Chọn đóa sen dâng Bác:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LOTUS_OFFERINGS.map((lotus) => {
                  const isSelected = selectedLotus === lotus.id;
                  return (
                    <button
                      key={lotus.id}
                      onClick={() => {
                        soundCtrl.playChime(650);
                        setSelectedLotus(lotus.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-red-600 bg-pink-50/90 ring-2 ring-pink-300 shadow-md'
                          : 'border-amber-200 bg-white hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: lotus.color }}
                        />
                        <span className="text-xs font-extrabold text-amber-950">{lotus.name}</span>
                      </div>
                      <span className="text-[11px] text-stone-600">{lotus.meaning}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose or Write Student Pledge */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-amber-950">2. Lời hứa của bé kính dâng Bác:</label>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_PLEDGES.map((pledge, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPledge(pledge)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedPledge === pledge
                        ? 'bg-amber-200 border-amber-400 text-amber-950 font-bold'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    ⭐ {pledge}
                  </button>
                ))}
              </div>

              {/* Student custom text */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Hoặc tự viết lời hứa của bé ở đây (ví dụ: Con hứa thi học kỳ đạt điểm 10 toán...)"
                  value={selectedPledge}
                  onChange={(e) => setSelectedPledge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Student name */}
              <div className="mt-1">
                <input
                  type="text"
                  placeholder="Họ tên của bé (ví dụ: Nguyễn Minh Anh - Lớp 3A)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-amber-300 bg-white text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Flower Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-amber-800 font-semibold">
                Đã có <strong className="text-red-600 font-black">{offeredCount}</strong> đóa sen được thiếu nhi dâng lên Bác
              </span>

              <button
                onClick={handleOfferFlower}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>🪷</span>
                <span>Thành kính dâng hoa lên Bác</span>
              </button>
            </div>

            {flowerSubmitted && (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center animate-fade-in">
                <span className="text-2xl">🙏</span>
                <h4 className="font-extrabold text-emerald-950 text-sm">
                  Đóa hoa sen và lời hứa của bé đã được đặt trang trọng trên bàn thờ Bác!
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Bác Hồ sẽ luôn mỉm cười dõi theo từng bước tiến bộ của các cháu!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
