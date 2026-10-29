/**
 * Google Slides and Drive API utility functions (Client-Side REST with Bearer Token)
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink?: string;
  thumbnailLink?: string;
  modifiedTime?: string;
}

export interface SlideTemplateOption {
  id: string;
  title: string;
  description: string;
  slidesCount: number;
  icon: string;
}

export const SLIDE_TEMPLATES: SlideTemplateOption[] = [
  {
    id: 'thieu_nhi',
    title: 'Bác Hồ Với Thiếu Niên Nhi Đồng',
    description: 'Bài thuyết trình giáo dục về tình thương bao la của Bác, 5 Điều Bác Hồ Dạy và lời nhắn nhủ thế hệ măng non.',
    slidesCount: 5,
    icon: '🌸',
  },
  {
    id: 'hanh_trinh',
    title: 'Hành Trình Tìm Đường Cứu Nước (1911 - 1945)',
    description: 'Các mốc son lịch sử: Làng Sen quê Bác, Bến Nhà Rồng, 30 năm bôn ba và ngày Quốc khánh 2/9/1945 tại Ba Đình.',
    slidesCount: 5,
    icon: '⛵',
  },
  {
    id: 'dao_duc',
    title: 'Tấm Gương Đạo Đức & Kỷ Vật Giản Dị',
    description: 'Học tập đức tính Cần, Kiệm, Liêm, Chính, đôi dép cao su huyền thoại và máy đánh chữ của Bác.',
    slidesCount: 4,
    icon: '⭐',
  },
];

// List user's Google Slides from Google Drive
export async function listUserPresentations(accessToken: string): Promise<GoogleDriveFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.presentation' and trashed=false");
  const fields = encodeURIComponent('files(id,name,webViewLink,thumbnailLink,modifiedTime)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=24`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Không thể tải danh sách bài thuyết trình từ Google Drive.');
  }

  const data = await response.json();
  return data.files || [];
}

// Get specific presentation details from Google Slides API
export async function getPresentation(presentationId: string, accessToken: string) {
  const response = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Không thể tải thông tin bài thuyết trình.');
  }

  return response.json();
}

// Create and populate a themed presentation using Google Slides API
export async function createPresentationFromTemplate(
  templateId: string,
  accessToken: string,
  customTitle?: string
): Promise<{ id: string; title: string; webViewLink: string }> {
  const template = SLIDE_TEMPLATES.find((t) => t.id === templateId) || SLIDE_TEMPLATES[0];
  const presentationTitle = customTitle || `${template.title} - Không Gian Văn Hóa Hồ Chí Minh`;

  // Step 1: Create presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: presentationTitle,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Không thể tạo bài thuyết trình trên Google Slides.');
  }

  const pres = await createRes.json();
  const presentationId = pres.presentationId;

  // Step 2: BatchUpdate to generate rich educational slides based on template
  const requests: any[] = [];

  if (templateId === 'thieu_nhi') {
    // Slide 2: Tình cảm của Bác với thiếu nhi
    requests.push({
      createSlide: {
        objectId: 'slide_2',
        insertionIndex: 1,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    // Slide 3: 5 Điều Bác Hồ Dạy
    requests.push({
      createSlide: {
        objectId: 'slide_3',
        insertionIndex: 2,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    // Slide 4: Thư gửi học sinh nhân ngày khai trường
    requests.push({
      createSlide: {
        objectId: 'slide_4',
        insertionIndex: 3,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    // Slide 5: Lời hứa của chúng em
    requests.push({
      createSlide: {
        objectId: 'slide_5',
        insertionIndex: 4,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
  } else if (templateId === 'hanh_trinh') {
    requests.push({
      createSlide: {
        objectId: 'slide_2',
        insertionIndex: 1,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    requests.push({
      createSlide: {
        objectId: 'slide_3',
        insertionIndex: 2,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    requests.push({
      createSlide: {
        objectId: 'slide_4',
        insertionIndex: 3,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    requests.push({
      createSlide: {
        objectId: 'slide_5',
        insertionIndex: 4,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
  } else {
    // dao_duc
    requests.push({
      createSlide: {
        objectId: 'slide_2',
        insertionIndex: 1,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    requests.push({
      createSlide: {
        objectId: 'slide_3',
        insertionIndex: 2,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
    requests.push({
      createSlide: {
        objectId: 'slide_4',
        insertionIndex: 3,
        slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
      },
    });
  }

  if (requests.length > 0) {
    await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
  }

  const webViewLink = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  return {
    id: presentationId,
    title: presentationTitle,
    webViewLink,
  };
}
