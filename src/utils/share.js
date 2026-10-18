/** Các hàm hỗ trợ chia sẻ confession lên mạng xã hội */

/** Tạo link chia sẻ cho một confession (dựa trên URL hiện tại) */
export const buildShareUrl = (id) => {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#confession-${id}`;
};

/** Sao chép text vào clipboard (fallback nếu browser chặn Clipboard API) */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};

/** Tạo nội dung chia sẻ đẹp kèm trích dẫn + link */
export const formatSharePayload = (url, quote, id) => {
  const trimmed = (quote || '').trim();
  const excerpt = trimmed.length > 180 ? `${trimmed.slice(0, 180)}…` : trimmed;
  return `💌 Love12B2 Confession ${id ? `#${id}` : ''}\n“${excerpt}”\n👉 Xem tại: ${url}`;
};

/**
 * Mở cửa sổ chia sẻ Facebook ổn định:
 * - Tự động copy sẵn nội dung + link vào clipboard (phòng trường hợp Facebook chặn quote hoặc chạy localhost)
 * - Nếu URL là localhost/127.0.0.1 (Facebook từ chối scrape), dùng domain public fallback để hộp thoại FB luôn mở mượt
 */
export const shareFacebook = async (url, quote, id) => {
  const payload = formatSharePayload(url, quote, id);
  await copyToClipboard(payload);

  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.|10\.)/i.test(url);
  const targetUrl = isLocal
    ? 'https://github.com/huyflou1/love12b2-confession'
    : url;

  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}&quote=${encodeURIComponent(payload)}`;
  window.open(fb, '_blank', 'noopener,noreferrer,width=680,height=560');
  return true;
};

/**
 * Chia sẻ TikTok: copy sẵn caption + link vào clipboard rồi mở TikTok.
 */
export const shareTikTok = async (url, quote, id) => {
  const payload = `${formatSharePayload(url, quote, id)}\n#Love12B2 #Confession`;
  const copied = await copyToClipboard(payload);
  window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
  return copied;
};

/**
 * Chia sẻ Messenger: copy sẵn nội dung + link rồi mở Messenger.
 */
export const shareMessenger = async (url, quote, id) => {
  const payload = formatSharePayload(url, quote, id);
  const copied = await copyToClipboard(payload);
  window.open('https://www.messenger.com/', '_blank', 'noopener,noreferrer');
  return copied;
};

/** Dùng Web Share API nếu thiết bị hỗ trợ (mobile/Windows Share), fallback copy */
export const shareNative = async (url, quote, id) => {
  const payload = formatSharePayload(url, quote, id);
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Love12B2 Confession ${id ? `#${id}` : ''}`,
        text: `“${quote}”`,
        url,
      });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  await copyToClipboard(payload);
  return 'copied';
};

/** Định dạng thời gian kiểu "3 giờ trước" */
export const timeAgo = (iso) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  return `${weeks} tuần trước`;
};

/** Định dạng số like: 1200 → 1.200 */
export const formatCount = (n) => new Intl.NumberFormat('vi-VN').format(n);

/** Ngày giờ cụ thể kiểu VN: "14:30 · 15/10/2026" */
export const formatDateTime = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    return `${hh}:${mm} · ${dd}/${mo}/${d.getFullYear()}`;
  } catch {
    return '';
  }
};
