/**
 * Dữ liệu giả (Mock Data) cho Love12B2 Confession.
 * Mỗi confession: id, author (null = ẩn danh), topic, content, hearts,
 * comments, icon (emoji kute), createdAt (ISO), pinned.
 */

export const TOPICS = [
  { id: 'love', label: 'Tình yêu', emoji: '💗', chipBg: 'bg-pink-100 text-pink-600 border-pink-200' },
  { id: 'school', label: 'Học đường', emoji: '🎒', chipBg: 'bg-sky-100 text-sky-600 border-sky-200' },
  { id: 'life', label: 'Cuộc sống', emoji: '🌈', chipBg: 'bg-violet-100 text-violet-600 border-violet-200' },
  { id: 'secret', label: 'Bí mật', emoji: '🔒', chipBg: 'bg-amber-100 text-amber-600 border-amber-200' },
];

export const CUTE_ICONS = [
  '🐶', '🐱', '🐰', '🐻', '🐼', '🐨', '🦊', '🐷',
  '💖', '🌸', '🧸', '🍭', '🎀', '☁️', '🌟', '🐣',
];

export const topicOf = (id) => TOPICS.find((t) => t.id === id) ?? TOPICS[0];

/**
 * Bộ emoji reactions — thay cho nút Tim đơn thuần.
 * heart: giữ nguyên số `hearts` của bài; các loại còn lại đếm riêng trong `reactions`.
 */
export const REACTIONS = [
  { id: 'heart', emoji: '❤️', label: 'Tim' },
  { id: 'cry', emoji: '😭', label: 'Đồng cảm' },
  { id: 'please', emoji: '🥺', label: 'Thương thương' },
  { id: 'secret', emoji: '🤫', label: 'Giữ bí mật' },
  { id: 'tea', emoji: '🍵', label: 'Hóng hớt' },
  { id: 'cheese', emoji: '🧀', label: 'Thả thính' },
];

/** Khởi tạo object đếm reactions rỗng cho confession */
export const emptyReactions = () => ({ cry: 0, please: 0, secret: 0, tea: 0, cheese: 0 });

/** Seed số liệu demo cho reactions dựa trên lượt tim (chỉ dùng khi migrate dữ liệu cũ) */
export const seedReactions = (hearts) => ({
  cry: Math.round(hearts * 0.32),
  please: Math.round(hearts * 0.27),
  secret: Math.round(hearts * 0.14),
  tea: Math.round(hearts * 0.21),
  cheese: Math.round(hearts * 0.09),
});

export const MOCK_CONFESSIONS = [
  {
    id: 101,
    author: null,
    topic: 'love',
    icon: '🐶',
    content:
      'Tớ thích cậu bạn bàn trên suốt hai năm rồi. Mỗi lần cậu quay lại mượn tẩy là tim tớ muốn nhảy ra khỏi lồng ngực. Tớ chưa đủ can đảm để nói, nhưng viết ra đây thấy nhẹ lòng hơn hẳn 💗',
    hearts: 342,
    pinned: false,
    createdAt: '2026-10-15T09:20:00.000Z',
    comments: [
      { id: 1001, author: null, content: 'Can đảm lên, nói đi cậu! Cuộc đời ngắn lắm 🌸', createdAt: '2026-10-15T10:00:00.000Z' },
      { id: 1002, author: 'Mèo ú', content: 'Trời ơi dễ thương quá 😭💗', createdAt: '2026-10-15T11:30:00.000Z' },
    ],
  },
  {
    id: 102,
    author: 'Bí ẩn 12B2',
    topic: 'school',
    icon: '🎒',
    content:
      'Hôm thi cuối kỳ Toán, tớ ngồi sau nhưng mắt cứ dán lên bảng. Không phải tớ không biết làm — mà là tớ đang nhớ nụ cười hôm cô đọc điểm 10 của mình. Cảm ơn bạn đã ngồi cạnh, động viên tớ suốt tuần ôn thi 🌟',
    hearts: 289,
    pinned: false,
    createdAt: '2026-10-14T13:05:00.000Z',
    comments: [
      { id: 1003, author: null, content: 'Bạn ngồi cạnh chắc cũng thương cậu lắm đó 😆', createdAt: '2026-10-14T14:00:00.000Z' },
    ],
  },
  {
    id: 103,
    author: null,
    topic: 'secret',
    icon: '🔮',
    content:
      'Bí mật tớ giữ 3 năm: cái ngày bố mẹ ly hôn, tớ đã khóc trong nhà vệ sinh trường 45 phút. Ai cũng nghĩ tớ vui tính, nhưng không ai biết tớ mang theo một nỗi buồn rất to suốt từng đó năm…',
    hearts: 517,
    pinned: false,
    createdAt: '2026-10-13T20:45:00.000Z',
    comments: [
      { id: 1004, author: null, content: 'Ôm cậu thật chặt 🧸 Không sao đâu, mọi thứ sẽ ổn thôi.', createdAt: '2026-10-13T21:10:00.000Z' },
      { id: 1005, author: 'Bạn nào đó', content: 'Mình cũng vậy… đọc mà khóc thật sự 💧', createdAt: '2026-10-14T07:00:00.000Z' },
      { id: 1006, author: null, content: 'Cậu mạnh mẽ hơn cậu nghĩ nhiều đó ❤️‍🩹', createdAt: '2026-10-14T08:20:00.000Z' },
    ],
  },
  {
    id: 104,
    author: null,
    topic: 'life',
    icon: '🌈',
    content:
      'Mình apply 12 trường đại học, trượt 11. Hôm nhận giấy báo cuối mình khóc nức nở. Nhưng rồi trời xui khiến mình vào đúng ngành mình yêu nhất. Cứ bước tiếp đi, cánh cửa sau sẽ mở 🌈',
    hearts: 428,
    pinned: false,
    createdAt: '2026-10-12T08:00:00.000Z',
    comments: [
      { id: 1007, author: null, content: 'Câu chuyện truyền cảm hứng nhất tuần 🌟', createdAt: '2026-10-12T09:15:00.000Z' },
    ],
  },
  {
    id: 105,
    author: 'Cô bé mộng mơ',
    topic: 'love',
    icon: '🐰',
    content:
      'Cậu ấy chuyển trường đi rồi. Tớ vẫn giữ cuốn vở cậu ấy tặng, viết dở trang giữa chừng. Giá mà ngày ấy tớ nói một câu: "Đừng đi mà…" 🐇',
    hearts: 261,
    pinned: false,
    createdAt: '2026-10-11T19:30:00.000Z',
    comments: [
      { id: 1008, author: null, content: 'Níu giữ ký ức đẹp thôi cậu, rồi sẽ có người xứng đáng 🌸', createdAt: '2026-10-11T20:00:00.000Z' },
    ],
  },
  {
    id: 106,
    author: null,
    topic: 'school',
    icon: '🐣',
    content:
      'Nhờ Love12B2, mình nghe lời bạn ấy "mình thích cậu" sau 300 ngày. Đừng im lặng nữa các bạn ơi, thanh xuân không có lần hai 🐣',
    hearts: 198,
    pinned: false,
    createdAt: '2026-10-10T15:10:00.000Z',
    comments: [],
  },
  {
    id: 107,
    author: null,
    topic: 'secret',
    icon: '☁️',
    content:
      'Bí mật nho nhỏ: tớ hay vào đây đọc confession của người khác lúc buồn lắm. Và tớ thấy mình không hề đơn độc 🤍',
    hearts: 156,
    pinned: false,
    createdAt: '2026-10-09T22:00:00.000Z',
    comments: [
      { id: 1009, author: null, content: 'Mình cũng vậy 🥺 Nơi này ấm áp ghê', createdAt: '2026-10-09T23:00:00.000Z' },
    ],
  },
  {
    id: 108,
    author: 'Anonymous 🌙',
    topic: 'life',
    icon: '🌟',
    content:
      'Hôm nay là 365 ngày mình cai nghiện mạng xã hội. Nhiều thời gian hơn, ngủ ngon hơn, và đọc được hàng trăm câu chuyện thật như ở đây. Cảm ơn các bạn 🌙',
    hearts: 143,
    pinned: false,
    createdAt: '2026-10-08T10:30:00.000Z',
    comments: [],
  },
];

/** Nội dung tĩnh của trang — admin có thể sửa từ Control Panel */
export const DEFAULT_SITE_CONTENT = {
  heroTitle: 'Nơi sẻ chia những điều chưa từng nói',
  heroSubtitle:
    '100% ẩn danh · Không ai biết bạn là ai · Chỉ cần viết ra, nhẹ lòng hơn 💗',
  brandName: 'Love12B2 confession',
  footerPrivacy:
    'Chúng tôi không thu thập tên thật, số điện thoại hay địa chỉ IP. Mọi confession được ẩn danh tuyệt đối.',
  footerPromise:
    'Cam kết 100% ẩn danh: không đăng nhập, không theo dõi, không bán dữ liệu. Những điều bạn viết chỉ để nhẹ lòng.',
};
