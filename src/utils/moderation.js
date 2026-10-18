/**
 * Bộ Lọc Từ Khóa Văn Minh (Auto AI Content Moderation - rule-based).
 * - level "block": chứa thông tin nhạy cảm (SĐT, email, địa chỉ) → CHẶN gửi.
 * - level "warn": chứa từ ngữ công kích/xúc phạm/toxic → CẢNH BÁO nhưng vẫn cho gửi.
 */

const TOXIC_WORDS = [
  'óc chó', 'ngu si', 'đần độn', 'thằng ngu', 'con ngu', 'đồ ngu',
  'xấu như', 'biến đi', 'cút đi', 'cút', 'đồ tồi', 'khốn nạn', 'khốn',
  'mất dạy', 'vô học', 'não ngắn', 'đầu đất', 'ăn hại', 'bất tài',
  'địt', 'lồn', 'cặc', 'đéo', 'đm', 'vcl', 'vkl', 'fuck', 'shit', 'bitch',
  'giết', 'chết đi', 'tự tử', 'đánh chết', 'xử nó',
];

const PHONE_RE = /(?:\+?84|0)(?:\s*\.?\s*\d){9}\b/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const ADDRESS_RE =
  /(số\s*nhà|\d+\s*(đường|phố|hẻm|ngõ|ngách|ấp|thôn|xóm|tổ|khu\s*phố|chung\s*cư|tòa\s*nhà|phường|xã|quận|huyện|tỉnh|thành\s*phố))/i;

const SENSITIVE_CHECKS = [
  { type: 'phone', re: PHONE_RE, message: 'Phát hiện SỐ ĐIỆN THOẠI — hãy xoá để bảo vệ riêng tư 🛡️' },
  { type: 'email', re: EMAIL_RE, message: 'Phát hiện ĐỊA CHỈ EMAIL — hãy xoá để bảo vệ riêng tư 🛡️' },
  { type: 'address', re: ADDRESS_RE, message: 'Phát hiện ĐỊA CHỈ CÁ NHÂN — hãy xoá để bảo vệ riêng tư 🛡️' },
];

/** Chuẩn hoá text để so khớp: thường hoá, bỏ dấu lặp */
const normalize = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-zà-ỹ0-9\s+@.]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Kiểm duyệt 1 đoạn text.
 * @returns {{ level: 'ok'|'warn'|'block', issues: Array<{type, message, match?}> }}
 */
export const moderateText = (text) => {
  const issues = [];
  const raw = text || '';

  for (const check of SENSITIVE_CHECKS) {
    const m = raw.match(check.re);
    if (m) {
      issues.push({ type: check.type, level: 'block', message: check.message, match: m[0] });
    }
  }
  if (issues.length > 0) return { level: 'block', issues };

  const norm = ` ${normalize(raw)} `;
  const found = TOXIC_WORDS.filter((w) => norm.includes(w)).slice(0, 3);
  for (const w of found) {
    issues.push({
      type: 'toxic',
      level: 'warn',
      message: `Phát hiện từ ngữ nhạy cảm: “${w}” — hãy dùng lời lẽ nhẹ nhàng hơn nhé 💗`,
      match: w,
    });
  }
  return { level: issues.length > 0 ? 'warn' : 'ok', issues };
};
