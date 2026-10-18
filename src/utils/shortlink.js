/** Mã hoá ID bài viết thành short-code ngắn gọn (base62) để chia sẻ lên Story/Messenger */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** 101 → "1d", Date.now() → chuỗi ~7 ký tự */
export const encodeId = (num) => {
  let n = Number(num);
  if (!Number.isFinite(n) || n < 0) n = 0;
  n = Math.floor(n);
  if (n === 0) return '0';
  let out = '';
  while (n > 0) {
    out = ALPHABET[n % 62] + out;
    n = Math.floor(n / 62);
  }
  return out;
};

/** "1d" → 101 (trả về null nếu code không hợp lệ) */
export const decodeId = (code) => {
  if (typeof code !== 'string' || !/^[0-9A-Za-z]{1,12}$/.test(code)) return null;
  let n = 0;
  for (const ch of code) {
    n = n * 62 + ALPHABET.indexOf(ch);
  }
  return n;
};

/** Link ngắn của 1 confession, vd: https://love12b2.app/#c/1d */
export const buildShortUrl = (id) => {
  const base = `${window.location.origin}${window.location.pathname}`;
  return typeof id === 'number'
    ? `${base}#c/${encodeId(id)}`
    : `${base}#confession-${encodeURIComponent(String(id))}`;
};

/** Đọc short-code từ hash hiện tại của trình duyệt (hỗ trợ cả link cũ #confession-<id>) */
export const parseHashTarget = () => {
  const hash = window.location.hash || '';
  const short = hash.match(/^#c\/([0-9A-Za-z]{1,12})$/);
  if (short) {
    const id = decodeId(short[1]);
    return id === null ? null : { id, shortCode: short[1] };
  }
  const legacy = hash.match(/^#confession-(.+)$/);
  if (legacy) {
    try { return { id: decodeURIComponent(legacy[1]), shortCode: null }; }
    catch { return null; }
  }
  return null;
};
