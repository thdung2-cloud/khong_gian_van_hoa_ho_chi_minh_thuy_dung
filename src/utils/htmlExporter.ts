import { EXHIBIT_ITEMS, EXHIBIT_CATEGORIES } from '../data/exhibits';
import { QUIZ_QUESTIONS } from '../data/games';

/**
 * Generates a complete, beautiful standalone HTML document containing all
 * educational materials, 5 teachings of Uncle Ho, exhibit zones, quiz questions,
 * and print/PDF support. Can be opened offline anywhere without a server.
 */
export function generateStandaloneHtml(): string {
  const generatedTime = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const exhibitSectionsHtml = EXHIBIT_CATEGORIES.filter((c) => c.id !== 'all')
    .map((cat) => {
      const items = EXHIBIT_ITEMS.filter((item) => item.category === cat.id);
      if (items.length === 0) return '';

      const itemsHtml = items
        .map(
          (item) => `
        <article class="exhibit-card">
          <div class="card-header">
            <span class="badge">Khu ${item.zone}</span>
            <span class="category-tag">${cat.name}</span>
          </div>
          <h4 class="card-title">${item.title}</h4>
          <p class="short-desc"><strong>Tóm tắt:</strong> ${item.shortDesc}</p>
          <div class="story-box">
            <h5>📖 Câu chuyện chi tiết:</h5>
            <p>${item.fullStory}</p>
          </div>
          ${
            item.funFact
              ? `
          <div class="fun-fact-box">
            <span class="icon">💡</span>
            <div><strong>Góc hiểu biết:</strong> ${item.funFact}</div>
          </div>
          `
              : ''
          }
          ${
            item.quote
              ? `
          <blockquote class="quote-box">
            <div class="quote-text">"${item.quote}"</div>
            <div class="quote-author">— Chủ tịch Hồ Chí Minh</div>
          </blockquote>
          `
              : ''
          }
        </article>
      `
        )
        .join('\n');

      return `
      <section class="zone-section" id="cat-${cat.id}">
        <div class="zone-header">
          <span class="zone-icon">${cat.icon}</span>
          <h3>${cat.name} (${items.length} tư liệu)</h3>
        </div>
        <div class="cards-grid">
          ${itemsHtml}
        </div>
      </section>
    `;
    })
    .join('\n');

  const quizQuestionsHtml = QUIZ_QUESTIONS.map(
    (q, idx) => `
    <div class="quiz-item">
      <div class="quiz-header">
        <span class="quiz-number">Câu ${idx + 1}</span>
        <span class="quiz-badge">${q.badgeAward}</span>
      </div>
      <p class="quiz-question">${q.question}</p>
      <div class="quiz-options">
        ${q.options
          .map(
            (opt, optIdx) => `
          <div class="quiz-opt ${optIdx === q.correctAnswer ? 'is-correct' : ''}">
            <span class="opt-letter">${String.fromCharCode(65 + optIdx)}.</span>
            <span>${opt}</span>
            ${optIdx === q.correctAnswer ? '<span class="correct-check">✓ (Đáp án đúng)</span>' : ''}
          </div>
        `
          )
          .join('\n')}
      </div>
      <div class="quiz-explanation">
        <strong>Giải thích:</strong> ${q.explanation}
        <br>
        <span class="fun-tip">🌟 <em>Lời khuyên:</em> ${q.funTip}</span>
      </div>
    </div>
  `
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Không Gian Văn Hóa Hồ Chí Minh - Tài Liệu Giáo Dục Toàn Diện</title>
  <meta name="description" content="Tài liệu Không Gian Văn Hóa Hồ Chí Minh đầy đủ các khu trưng bày, 5 điều Bác dạy, lời căn dặn và bộ câu hỏi trắc nghiệm lịch sử tiểu học.">
  <style>
    :root {
      --primary: #dc2626;
      --primary-dark: #991b1b;
      --gold: #d97706;
      --gold-light: #fef3c7;
      --gold-dark: #b45309;
      --bg-page: #fbfbfa;
      --text-main: #1f2937;
      --text-muted: #4b5563;
      --border-color: #e5e7eb;
      --card-bg: #ffffff;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Be Vietnam Pro", sans-serif;
      background-color: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }

    /* Top Sticky Action Bar */
    .top-actions-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #1c1917;
      color: #fef3c7;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--gold);
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    .top-actions-left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 14px;
    }
    .top-actions-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: #dc2626;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #b91c1c;
    }
    .btn-gold {
      background: #f59e0b;
      color: #1c1917;
    }
    .btn-gold:hover {
      background: #d97706;
    }
    .btn-outline {
      background: transparent;
      color: #fef3c7;
      border: 1px solid #78716c;
    }
    .btn-outline:hover {
      background: #292524;
      border-color: #d97706;
    }

    /* Container */
    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 30px 20px 80px 20px;
    }

    /* Hero Header */
    .hero-header {
      text-align: center;
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b45309 100%);
      color: #ffffff;
      padding: 40px 25px;
      border-radius: 20px;
      margin-bottom: 35px;
      box-shadow: var(--shadow-md);
      position: relative;
      border: 2px solid #f59e0b;
    }
    .hero-flag {
      font-size: 44px;
      margin-bottom: 10px;
    }
    .hero-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      text-transform: uppercase;
      color: #fef08a;
    }
    .hero-subtitle {
      font-size: 16px;
      font-weight: 500;
      color: #fef9c3;
      max-width: 720px;
      margin: 0 auto 15px auto;
    }
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      font-size: 13px;
      color: #fde047;
      font-weight: 600;
    }

    /* Quick TOC nav */
    .quick-nav {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 30px;
      box-shadow: var(--shadow-sm);
    }
    .quick-nav-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--gold-dark);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .quick-nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .quick-nav-link {
      padding: 6px 12px;
      background: #f3f4f6;
      color: #374151;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .quick-nav-link:hover {
      background: #fee2e2;
      color: #b91c1c;
    }

    /* Teachings of Uncle Ho Section */
    .teachings-section {
      background: #fffbeb;
      border: 2px solid #f59e0b;
      border-radius: 16px;
      padding: 26px;
      margin-bottom: 35px;
      box-shadow: var(--shadow-sm);
    }
    .teachings-title {
      color: #9a3412;
      font-size: 20px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .teachings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
    }
    .teaching-card {
      background: #ffffff;
      border: 1px solid #fed7aa;
      border-left: 5px solid #ea580c;
      padding: 14px 16px;
      border-radius: 10px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .teaching-num {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
      background: #ea580c;
      padding: 2px 8px;
      border-radius: 12px;
      margin-bottom: 6px;
    }
    .teaching-content {
      font-size: 15px;
      font-weight: 700;
      color: #9a3412;
      margin-bottom: 4px;
    }
    .teaching-desc {
      font-size: 12px;
      color: #4b5563;
    }

    /* Altar Section */
    .altar-section {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-top: 4px solid #dc2626;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 35px;
      box-shadow: var(--shadow-sm);
    }
    .altar-title {
      font-size: 18px;
      font-weight: 800;
      color: #991b1b;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .altar-content {
      font-size: 14px;
      color: #374151;
      line-height: 1.7;
    }

    /* Zone sections */
    .zone-section {
      margin-bottom: 40px;
    }
    .zone-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 10px;
      margin-bottom: 18px;
      border-bottom: 2px solid var(--gold);
    }
    .zone-header h3 {
      font-size: 20px;
      font-weight: 800;
      color: #1f2937;
    }
    .zone-icon {
      font-size: 24px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }

    .exhibit-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 18px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .badge {
      font-size: 11px;
      font-weight: 800;
      color: #991b1b;
      background: #fee2e2;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .category-tag {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      line-height: 1.35;
    }
    .short-desc {
      font-size: 13px;
      color: #4b5563;
    }
    .story-box {
      background: #f9fafb;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 12.5px;
      color: #374151;
      line-height: 1.55;
    }
    .story-box h5 {
      font-size: 12px;
      font-weight: 700;
      color: #b45309;
      margin-bottom: 4px;
    }
    .fun-fact-box {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 12px;
      color: #1e40af;
    }
    .quote-box {
      background: #fefce8;
      border-left: 3px solid #eab308;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 12px;
      font-style: italic;
      color: #854d0e;
    }
    .quote-author {
      font-weight: 700;
      font-style: normal;
      margin-top: 4px;
      text-align: right;
      font-size: 11px;
    }

    /* Quiz Section */
    .quiz-section {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 26px;
      margin-bottom: 35px;
      box-shadow: var(--shadow-sm);
    }
    .quiz-title {
      font-size: 20px;
      font-weight: 800;
      color: #991b1b;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quiz-subtitle {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 20px;
    }
    .quiz-item {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      background: #fafaf9;
    }
    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .quiz-number {
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
      background: #dc2626;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .quiz-badge {
      font-size: 11px;
      font-weight: 700;
      color: #b45309;
      background: #fef3c7;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .quiz-question {
      font-size: 15px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .quiz-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-bottom: 10px;
    }
    .quiz-opt {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 8px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      font-size: 13px;
    }
    .quiz-opt.is-correct {
      background: #ecfdf5;
      border-color: #10b981;
      color: #065f46;
      font-weight: 600;
    }
    .opt-letter {
      font-weight: 700;
      color: #6b7280;
    }
    .correct-check {
      margin-left: auto;
      font-size: 11px;
      font-weight: 700;
      color: #059669;
    }
    .quiz-explanation {
      font-size: 12px;
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      padding: 8px 12px;
      border-radius: 4px;
      color: #92400e;
    }
    .fun-tip {
      display: inline-block;
      margin-top: 4px;
      color: #b45309;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 30px 15px;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid var(--border-color);
      margin-top: 40px;
    }

    /* Print styles */
    @media print {
      .top-actions-bar {
        display: none !important;
      }
      body {
        background: #ffffff;
        color: #000000;
      }
      .container {
        padding: 0;
        max-width: 100%;
      }
      .hero-header {
        background: none;
        color: #000000;
        border: 2px solid #000000;
        box-shadow: none;
      }
      .hero-title {
        color: #b91c1c;
      }
      .hero-subtitle, .hero-meta {
        color: #333333;
      }
      .exhibit-card, .quiz-item, .teachings-section {
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <!-- Top Action Bar -->
  <header class="top-actions-bar">
    <div class="top-actions-left">
      <span>🇻🇳</span>
      <span>Không Gian Văn Hóa Hồ Chí Minh (Tài liệu HTML Offline)</span>
    </div>
    <div class="top-actions-right">
      <button class="btn btn-gold" onclick="window.print()">
        🖨️ In ấn / Lưu PDF
      </button>
      <button class="btn btn-outline" onclick="toggleAnswers()">
        👁️ Hiện/Ẩn đáp án trắc nghiệm
      </button>
    </div>
  </header>

  <main class="container">
    <!-- Hero Banner -->
    <section class="hero-header">
      <div class="hero-flag">🇻🇳 ⭐ 🌸</div>
      <h1 class="hero-title">Không Gian Văn Hóa Hồ Chí Minh</h1>
      <p class="hero-subtitle">
        Tài liệu số hóa tương tác &amp; tư liệu giáo dục truyền thống cách mạng dành cho thiếu niên, nhi đồng và học sinh tiểu học
      </p>
      <div class="hero-meta">
        <span>📅 Ngày xuất bản: ${generatedTime}</span>
        <span>🏛️ 4 Khu Trưng Bày Tư Liệu</span>
        <span>⭐ 5 Điều Bác Hồ Dạy</span>
        <span>📝 10 Câu Hỏi Đố Vui Lịch Sử</span>
      </div>
    </section>

    <!-- Quick Navigation -->
    <nav class="quick-nav">
      <div class="quick-nav-title">📌 Mục lục chuyển nhanh:</div>
      <div class="quick-nav-links">
        <a href="#bac-ho-day" class="quick-nav-link">⭐ 5 Điều Bác Hồ Dạy</a>
        <a href="#ban-tho-bac" class="quick-nav-link">🙏 Bàn Thờ Bác Hồ</a>
        <a href="#cat-thieu_nhi" class="quick-nav-link">🌸 Bác Hồ Với Thiếu Nhi</a>
        <a href="#cat-hanh_trinh" class="quick-nav-link">⛵ Hành Trình Cuộc Đời</a>
        <a href="#cat-dao_duc" class="quick-nav-link">⭐ Lời Dạy &amp; Đạo Đức</a>
        <a href="#cat-hien_vat" class="quick-nav-link">📜 Kỷ Vật &amp; Tác Phẩm</a>
        <a href="#trac-nghiem" class="quick-nav-link">📝 Bộ Câu Hỏi Trắc Nghiệm</a>
      </div>
    </nav>

    <!-- 5 Điều Bác Hồ Dạy -->
    <section class="teachings-section" id="bac-ho-day">
      <h2 class="teachings-title">
        <span>⭐</span>
        5 ĐIỀU BÁC HỒ DẠY THIẾU NIÊN, NHI ĐỒNG
        <span>⭐</span>
      </h2>
      <div class="teachings-grid">
        <div class="teaching-card">
          <span class="teaching-num">Điều 1</span>
          <div class="teaching-content">Yêu Tổ quốc, yêu đồng bào</div>
          <div class="teaching-desc">Luôn tự hào về đất nước Việt Nam thân yêu, thương yêu người thân, bạn bè và mọi người xung quanh.</div>
        </div>
        <div class="teaching-card">
          <span class="teaching-num">Điều 2</span>
          <div class="teaching-content">Học tập tốt, lao động tốt</div>
          <div class="teaching-desc">Chăm chỉ nghe giảng, làm bài tập đầy đủ, giúp đỡ gia đình những công việc vừa sức hàng ngày.</div>
        </div>
        <div class="teaching-card">
          <span class="teaching-num">Điều 3</span>
          <div class="teaching-content">Đoàn kết tốt, kỷ luật tốt</div>
          <div class="teaching-desc">Hòa đồng với bạn bè trường lớp, tuân thủ nội quy trường học và các quy định của địa phương.</div>
        </div>
        <div class="teaching-card">
          <span class="teaching-num">Điều 4</span>
          <div class="teaching-content">Giữ gìn vệ sinh thật tốt</div>
          <div class="teaching-desc">Giữ vệ sinh thân thể sạch sẽ, giữ gìn trường lớp xanh - sạch - đẹp, không xả rác bừa bãi.</div>
        </div>
        <div class="teaching-card">
          <span class="teaching-num">Điều 5</span>
          <div class="teaching-content">Khiêm tốn, thật thà, dũng cảm</div>
          <div class="teaching-desc">Không tự cao kiêu ngạo, luôn trung thực nói lời ngay thẳng và có dũng khí nhận lỗi, sửa sai.</div>
        </div>
      </div>
    </section>

    <!-- Bàn Thờ Bác Hồ -->
    <section class="altar-section" id="ban-tho-bac">
      <h3 class="altar-title">
        <span>🙏</span>
        Không Gian Tưởng Niệm - Bàn Thờ Chủ Tịch Hồ Chí Minh
      </h3>
      <div class="altar-content">
        <p>
          Bàn thờ Chủ tịch Hồ Chí Minh là trung tâm trang nghiêm nhất của Không Gian Văn Hóa. Nơi đây đặt tượng đồng Bác Hồ, Quốc kỳ cờ đỏ sao vàng, Đảng kỳ cờ búa liềm cùng những đóa hoa sen hồng thanh tao — biểu tượng của sự thuần khiết và lòng kính yêu vô hạn.
        </p>
        <p style="margin-top: 10px; font-style: italic; color: #b91c1c; font-weight: 600;">
          "Tháp Mười đẹp nhất bông sen - Việt Nam đẹp nhất có tên Bác Hồ."
        </p>
      </div>
    </section>

    <!-- Các Khu Vực Trưng Bày -->
    ${exhibitSectionsHtml}

    <!-- Bộ Câu Hỏi Trắc Nghiệm Ôn Tập -->
    <section class="quiz-section" id="trac-nghiem">
      <h3 class="quiz-title">
        <span>📝</span>
        Bộ Câu Hỏi Trắc Nghiệm Đố Vui Lịch Sử Bác Hồ (10 Câu Có Đáp Án)
      </h3>
      <p class="quiz-subtitle">
        Tài liệu phục vụ sinh hoạt Sao Nhi đồng, Đội Thiếu niên Tiền phong, giờ học Lịch sử - Đạo đức và ngoại khóa.
      </p>
      <div class="quiz-list" id="quizContainer">
        ${quizQuestionsHtml}
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p><strong>Không Gian Văn Hóa Hồ Chí Minh 3D</strong> — Tài liệu được xuất tự động dưới dạng tệp HTML độc lập.</p>
      <p>Thầy cô và các em học sinh có thể lưu trữ file này trong máy tính, USB hoặc gửi qua email, mở trên mọi trình duyệt mà không cần kết nối mạng Internet.</p>
    </footer>
  </main>

  <script>
    let showCorrect = true;
    function toggleAnswers() {
      showCorrect = !showCorrect;
      const elements = document.querySelectorAll('.correct-check');
      elements.forEach(el => {
        el.style.display = showCorrect ? 'inline' : 'none';
      });
      const explanations = document.querySelectorAll('.quiz-explanation');
      explanations.forEach(el => {
        el.style.display = showCorrect ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Triggers a browser download of the standalone HTML document.
 */
export function downloadStandaloneHtml(filename: string = 'Khong-Gian-Van-Hoa-Ho-Chi-Minh.html') {
  const htmlContent = generateStandaloneHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens the standalone HTML document in a new window/tab for printing or preview.
 */
export function openHtmlPreview() {
  const htmlContent = generateStandaloneHtml();
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(htmlContent);
    win.document.close();
  }
}
