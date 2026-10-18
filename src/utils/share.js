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

/** Mở cửa sổ chia sẻ Facebook */
export const shareFacebook = (url, quote) => {
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
  window.open(fb, '_blank', 'noopener,noreferrer,width=680,height=560');
};

/**
 * TikTok không có web-share API → chiến lược: copy link + gợi ý dán vào caption,
 * đồng thời mở TikTok web (nếu người dùng đang ở mobile sẽ chuyển sang app).
 */
export const shareTikTok = async (url, quote) => {
  const payload = `${quote.slice(0, 120)}…\n${url}`;
  const copied = await copyToClipboard(payload);
  window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
  return copied;
};

/** Dùng Web Share API nếu thiết bị hỗ trợ (mobile) */
export const shareNative = async (url, quote) => {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Love12B2 Confession', text: quote, url });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  return copyToClipboard(url);
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
