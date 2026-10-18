import { useEffect, useState } from 'react';
import { topicOf } from '../data/mockData.js';
import { buildShortUrl } from '../utils/shortlink.js';
import {
  copyToClipboard,
  formatSharePayload,
  shareFacebook,
  shareMessenger,
  shareNative,
  shareTikTok,
} from '../utils/share.js';

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.25.35.25.57l-.05 1.78c-.02.43.46.7.83.5l2.05-1.1c.14-.07.3-.1.46-.07 1.05.29 2.16.45 3.32.45 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.2 7.1-2.7 4.3c-.4.63-1.28.74-1.82.22l-2.16-2.05a.6.6 0 0 0-.85 0l-2.9 2.76c-.42.4-1.08-.05-.9-.6l2.7-4.3c.4-.63 1.28-.74 1.82-.22l2.16 2.05c.23.22.62.22.85 0l2.9-2.76c.42-.4 1.08.05.9.6z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M16.6 5.8A4.8 4.8 0 0 1 15.5 3h-3v12.1a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V9.5a5.7 5.7 0 0 0-.78-.05A5.7 5.7 0 1 0 15.5 15V8.9a7.8 7.8 0 0 0 4.5 1.45V7.3a4.8 4.8 0 0 1-3.4-1.5z" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3A5 5 0 0 0 13.4 3.4l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3A5 5 0 0 0 10.6 20.6l1.7-1.7" />
  </svg>
);

/**
 * ShareModal — popup chia sẻ viết lại DẠNG MODAL CHUẨN:
 * overlay toàn màn hình + căn giữa + đóng bằng nút X / click ra ngoài / phím ESC.
 * Khắc phục triệt để lỗi popup cũ bị cắt/tràn trong lưới Masonry.
 */
export default function ShareModal({ confession, onClose }) {
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');
  const shortUrl = buildShortUrl(confession.id);
  const topic = topicOf(confession.topic);

  // Đóng bằng phím ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const doCopy = async () => {
    const ok = await copyToClipboard(shortUrl);
    setCopied(ok);
    setNotice('✅ Đã sao chép link ngắn vào bộ nhớ tạm!');
    setTimeout(() => setCopied(false), 2000);
  };

  const doCopyFull = async () => {
    await copyToClipboard(formatSharePayload(shortUrl, confession.content, confession.id));
    setNotice('✅ Đã chép trọn bộ nội dung + link! Dán ngay lên Story/Status nhé 💗');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chia sẻ confession"
    >
      <div className="glass-card w-full max-w-sm animate-popIn p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            <h3 className="gradient-text text-lg font-bold">🔗 Chia sẻ confession</h3>
            <p className="text-xs font-semibold text-slate-500">
              {confession.icon} #{confession.id} · {topic.emoji} {topic.label}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full bg-white/70 px-2.5 py-1 text-sm font-bold text-slate-400 transition hover:bg-rose-100 hover:text-rose-500"
          >
            ✕
          </button>
        </div>

        <p className="mb-3 line-clamp-2 text-sm italic text-slate-500">“{confession.content}”</p>

        <p className="label-cute">✨ Link ngắn riêng của bài viết</p>
        <div className="mb-2 flex items-center gap-1.5">
          <input
            readOnly
            value={shortUrl}
            onFocus={(e) => e.target.select()}
            className="w-full truncate rounded-xl border border-fuchsia-200 bg-fuchsia-50/60 px-3 py-2 text-xs font-semibold text-fuchsia-600"
          />
          <button onClick={doCopy} className="btn-gradient shrink-0 !px-3 !py-2 text-xs">
            {copied ? '✅ Đã copy!' : '📋 Copy'}
          </button>
        </div>

        <button
          type="button"
          onClick={doCopyFull}
          className="mb-3 w-full rounded-xl border border-violet-200 bg-violet-50/70 py-1.5 text-xs font-bold text-violet-600 transition hover:bg-violet-100"
        >
          📝 Copy cả lời tâm sự + link (để dán Story / Status)
        </button>

        {notice && (
          <div className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-600">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={async () => {
              await shareFacebook(shortUrl, confession.content, confession.id);
              setNotice('📘 Đã mở Facebook & tự chép sẵn nội dung (bấm Ctrl+V để dán)!');
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1877F2]/10 py-2.5 text-xs font-bold text-[#1877F2] transition hover:bg-[#1877F2]/20"
          >
            <FacebookIcon /> Facebook
          </button>
          <button
            type="button"
            onClick={async () => {
              await shareTikTok(shortUrl, confession.content, confession.id);
              setNotice('🎵 Đã copy caption + link & mở TikTok (dán Ctrl+V vào mô tả)!');
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-black/10 py-2.5 text-xs font-bold text-black transition hover:bg-black/20"
          >
            <TikTokIcon /> TikTok
          </button>
          <button
            type="button"
            onClick={async () => {
              await shareMessenger(shortUrl, confession.content, confession.id);
              setNotice('💬 Đã copy nội dung + link & mở Messenger!');
            }}
            title="Sao chép link rồi mở Messenger để dán"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-500/10 py-2.5 text-xs font-bold text-violet-600 transition hover:bg-violet-500/20"
          >
            <MessengerIcon /> Messenger
          </button>
          <button
            type="button"
            onClick={async () => {
              const res = await shareNative(shortUrl, confession.content, confession.id);
              if (res === 'copied') {
                setNotice('📲 Đã copy nội dung + link vào bộ nhớ tạm!');
              }
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/20"
          >
            <LinkIcon /> Hệ thống / Story
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
          Link ngắn gắn mã bài viết — bạn bè mở link sẽ cuộn thẳng tới đúng bài 💗
        </p>
      </div>
    </div>
  );
}
