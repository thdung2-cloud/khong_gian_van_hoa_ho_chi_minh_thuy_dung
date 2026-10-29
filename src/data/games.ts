export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  funTip: string;
  badgeAward: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Bác Hồ sinh vào ngày tháng năm nào vậy các bạn?',
    options: ['19/05/1890', '02/09/1945', '03/02/1930', '30/04/1975'],
    correctAnswer: 0,
    explanation: 'Bác Hồ sinh ngày 19 tháng 5 năm 1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.',
    funTip: 'Mỗi dịp 19/5 hàng năm, thiếu nhi cả nước đều rộn ràng hát mừng sinh nhật Bác Hồ!',
    badgeAward: 'Búp Măng Thông Thái ⭐',
  },
  {
    id: 2,
    question: 'Ngày 05/06/1911, Bác Hồ đã ra đi tìm đường cứu nước từ địa danh lịch sử nào?',
    options: ['Bến Nhà Rồng (Sài Gòn)', 'Cột cờ Hà Nội', 'Cầu Hiền Lương', 'Hồ Gươm'],
    correctAnswer: 0,
    explanation: 'Ngày 5/6/1911, người thanh niên yêu nước Nguyễn Tất Thành đã bước lên tàu Đô đốc Latouche-Tréville tại Bến Nhà Rồng để sang phương Tây tìm con đường cứu nước.',
    funTip: 'Ngày nay Bến Nhà Rồng là Bảo tàng Hồ Chí Minh - Chi nhánh TP. Hồ Chí Minh.',
    badgeAward: 'Nhà Thám Hiểm Lịch Sử ⛵',
  },
  {
    id: 3,
    question: 'Khi làm việc trên con tàu vượt đại dương năm 1911, Bác đã lấy tên gọi thân thuộc là gì?',
    options: ['Anh Ba (Văn Ba)', 'Nguyễn Ái Quốc', 'Hồ Chí Minh', 'Lý Thụy'],
    correctAnswer: 0,
    explanation: 'Bác lấy tên Văn Ba (thường gọi là anh Ba) và làm công việc phụ bếp vất vả trên tàu để bắt đầu hành trình vĩ đại.',
    funTip: 'Bác đã dùng đôi bàn tay lao động cần cù của mình để tự trang trải suốt chặng đường.',
    badgeAward: 'Chiến Sĩ Kiên Trì 🌟',
  },
  {
    id: 4,
    question: 'Điều thứ 1 trong "5 Điều Bác Hồ Dạy" thiếu niên, nhi đồng là gì?',
    options: [
      'Yêu Tổ quốc, yêu đồng bào',
      'Học tập tốt, lao động tốt',
      'Đoàn kết tốt, kỷ luật tốt',
      'Giữ gìn vệ sinh thật tốt',
    ],
    correctAnswer: 0,
    explanation: 'Điều 1 là: "Yêu Tổ quốc, yêu đồng bào" - dạy chúng ta luôn yêu quê hương đất nước và thương yêu, giúp đỡ mọi người xung quanh.',
    funTip: 'Hãy cùng đọc to 5 Điều Bác Hồ dạy mỗi buổi sinh hoạt đầu tuần nhé!',
    badgeAward: 'Cháu Ngoan Bác Hồ 🎖️',
  },
  {
    id: 5,
    question: 'Ngày 02/09/1945 tại Quảng trường Ba Đình (Hà Nội), Bác Hồ đã đọc văn kiện lịch sử nào?',
    options: [
      'Bản Tuyên ngôn Độc lập',
      'Lời kêu gọi toàn quốc kháng chiến',
      'Bản Di chúc',
      'Bài thơ Chúc Tết',
    ],
    correctAnswer: 0,
    explanation: 'Bác đã đọc Bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa, nay là nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
    funTip: 'Hàng năm ngày 2 tháng 9 là ngày Quốc khánh thiêng liêng của toàn thể dân tộc Việt Nam.',
    badgeAward: 'Ngôi Sao Ba Đình 🚩',
  },
  {
    id: 6,
    question: 'Đôi dép huyền thoại gắn bó với Bác Hồ trong suốt hơn 20 năm kháng chiến được làm từ chất liệu gì?',
    options: [
      'Lốp xe ô tô cao su hỏng',
      'Da bò cao cấp',
      'Vải nhung',
      'Gỗ tre',
    ],
    correctAnswer: 0,
    explanation: 'Đôi dép của Bác được các chiến sĩ làm từ lốp ô tô quân sự của giặc bị ta bắn cháy. Bác đã đi đôi dép cao su giản dị này suốt hơn 20 năm.',
    funTip: 'Đôi dép cao su là biểu tượng sáng ngời cho tinh thần sống giản dị, tiết kiệm của Bác Hồ.',
    badgeAward: 'Đôi Dép Thần Kỳ 👟',
  },
  {
    id: 7,
    question: 'Bác Hồ từng làm nghề gì khi ở trường Dục Thanh (Phan Thiết) trước khi ra nước ngoài?',
    options: ['Thầy giáo dạy học', 'Bác sĩ', 'Kỹ sư', 'Họa sĩ'],
    correctAnswer: 0,
    explanation: 'Thầy giáo Nguyễn Tất Thành đã dạy chữ Quốc ngữ, chữ Hán và rèn luyện thể chất cho học trò nghèo tại trường Dục Thanh năm 1910.',
    funTip: 'Bác luôn dặn: "Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người".',
    badgeAward: 'Hoa Trạng Nguyên 📖',
  },
  {
    id: 8,
    question: 'Bác Hồ căn dặn học sinh: "Non sông Việt Nam có trở nên tươi đẹp hay không... chính là nhờ..."?',
    options: [
      'Một phần lớn ở công học tập của các cháu',
      'Trời mưa hay trời nắng',
      'Sự may mắn ngẫu nhiên',
      'Thời gian trôi qua',
    ],
    correctAnswer: 0,
    explanation: 'Bác tin tưởng giao trọn tương lai non sông vào sự chăm ngoan, nỗ lực học tập rèn đức luyện tài của các cháu học sinh.',
    funTip: 'Mỗi điểm 10 bé đạt được chính là bông hoa tươi thắm kính dâng lên Bác Hồ!',
    badgeAward: 'Mầm Non Đất Nước 🌸',
  },
];

export interface MemoryCard {
  id: number;
  symbolId: string;
  name: string;
  icon: string;
  image?: string;
  description: string;
}

export const MEMORY_CARDS_SOURCE = [
  { symbolId: 'sen', name: 'Hoa Sen Làng Sen', icon: '🪷', image: '/assets/aistudio/0-1_04aac2c3.jpg', description: 'Biểu tượng thanh tao của quê hương Bác' },
  { symbolId: 'tuong', name: 'Tượng Vàng Bác Hồ', icon: '✨', image: '/assets/aistudio/0_78d2b17c.png', description: 'Bác Hồ kính yêu của thiếu nhi' },
  { symbolId: 'dep', name: 'Đôi Dép Cao Su', icon: '👟', image: '/assets/aistudio/14_77d11e36.jpg', description: 'Kỷ vật thanh bạch giản dị của Bác' },
  { symbolId: 'thieu-nhi', name: 'Khăn Quàng Đỏ', icon: '🧣', image: '/assets/aistudio/2_774b4654.jpg', description: 'Đội Thiếu niên Tiền phong Hồ Chí Minh' },
  { symbolId: 'ben-tau', name: 'Bến Nhà Rồng', icon: '⛵', image: '/assets/aistudio/H_nh_tr_nh_cu_c___i_H__Ch__Minh_acd16d13.png', description: 'Nơi Bác ra đi tìm đường cứu nước' },
  { symbolId: 'co-do', name: 'Cờ Đỏ Sao Vàng', icon: '🚩', image: '/assets/aistudio/1_c53e7e10.jpeg', description: 'Quốc kỳ thiêng liêng của Tổ quốc' },
];

export interface TeachingItem {
  id: number;
  order: number;
  text: string;
  meaning: string;
  icon: string;
}

export const TEACHINGS_OF_BAC_HO: TeachingItem[] = [
  {
    id: 1,
    order: 1,
    text: 'Yêu Tổ quốc, yêu đồng bào',
    meaning: 'Biết tự hào về quê hương Việt Nam, yêu thương gia đình, giúp đỡ bạn bè và mọi người.',
    icon: '❤️',
  },
  {
    id: 2,
    order: 2,
    text: 'Học tập tốt, lao động tốt',
    meaning: 'Chăm chỉ nghe thầy cô giảng bài, làm bài tập đầy đủ, giúp bố mẹ việc nhà vừa sức.',
    icon: '📚',
  },
  {
    id: 3,
    order: 3,
    text: 'Đoàn kết tốt, kỷ luật tốt',
    meaning: 'Hòa đồng với bạn bè trong lớp, không cãi nhau, luôn chấp hành nội quy trường lớp.',
    icon: '🤝',
  },
  {
    id: 4,
    order: 4,
    text: 'Giữ gìn vệ sinh thật tốt',
    meaning: 'Rửa tay sạch sẽ, tắm rửa gọn gàng, bỏ rác đúng nơi quy định, giữ lớp sạch đẹp.',
    icon: '🧼',
  },
  {
    id: 5,
    order: 5,
    text: 'Khiêm tốn, thật thà, dũng cảm',
    meaning: 'Không khoe khoang, luôn nói sự thật với cha mẹ thầy cô, dám nhận lỗi khi làm sai.',
    icon: '🛡️',
  },
];

export const LOTUS_OFFERINGS = [
  { id: 'pink', name: 'Hoa Sen Hồng Tươi Thắm', color: '#EC4899', meaning: 'Tượng trưng cho lòng kính yêu sâu sắc của thiếu nhi' },
  { id: 'white', name: 'Hoa Sen Trắng Tinh Khiết', color: '#F8FAFC', meaning: 'Tượng trưng cho tâm hồn trong sáng, chân thành của tuổi thơ' },
  { id: 'gold', name: 'Hoa Sen Vàng Rực Rỡ', color: '#F59E0B', meaning: 'Tượng trưng cho lời hứa học tập xuất sắc, đền ơn Bác' },
];

export const PRESET_PLEDGES = [
  'Con hứa luôn chăm ngoan, nghe lời ông bà, cha mẹ và thầy cô giáo!',
  'Con hứa thực hiện thật tốt 5 Điều Bác Hồ dạy mỗi ngày!',
  'Con hứa giữ gìn vệ sinh cá nhân, trường lớp luôn xanh - sạch - đẹp!',
  'Con hứa đoàn kết, giúp đỡ bạn bè cùng tiến bộ trong học tập!',
  'Con hứa chăm chỉ đọc sách, rèn luyện thân thể khỏe mạnh!',
];
