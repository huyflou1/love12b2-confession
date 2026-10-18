import { useMemo, useState, useEffect } from 'react';
import { CUTE_ICONS } from '../data/mockData.js';

/**
 * RandomConfessionWidget — trong trẻo, đẹp mắt, thay thế Board Admin.
 * Vòng lặp: khi hover qua một bài sẽ hiển thị caption đầy đủ.
 * Phù hợp làm "thanh danh ngôn" nổi trên trang chủ, không cần login.
 */
export default function RandomConfessionWidget({ confessions, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);

  const list = useMemo(
    () => confessions.filter((c) => c.content && c.content.trim().length >= 10),
    [confessions]
  );

  // Nếu không có bất kỳ confession nào → fallback biệt
  const fallback = list.length === 0;

  // Chọn bài ngẫu nhiên giữa 0..n-1 (mỗi 6s hoán vị)
  useEffect(() => {
    if (fallback) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % list.length), 6000);
    return () => clearInterval(id);
  }, [list.length, fallback]);

  const item = list[current];
  const isItem = item !== undefined && item !== null;

  return (
    <aside
      className={`glass-card overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Tiêu đề */}
      <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 px-4 py-3 text-white">
        <h3 className="flex items-center gap-2 text-sm font-bold drop-shadow-sm">
          <span className="text-lg">💌</span>
          <span className="truncate">Danh ngôn ngẫu nhiên từ mọi người</span>
        </h3>
        <p className="text-xs text-white/80">Click vào để hiện thông báo mới</p>
      </div>

      {/* Hiển thị bài ngẫu nhiên */}
      <div className="p-4">
        {fallback ? (
          <p className="text-center text-sm italic text-slate-400">
            Chưa có danh ngôn nào… hãy là người đầu tiên gửi nhé ✨
          </p>
        ) : isItem ? (
          <>
            <div className={hover ? 'block' : 'hidden'}>
              <p className="text-xs font-bold text-violet-500 mb-1">
                {item.icon} {item.author ?? '🕵️ Ẩn danh'} · 📅 {new Date(item.createdAt).toLocaleString('vi-VN')}
              </p>
              <p className="text-sm leading-relaxed text-slate-600">{item.content}</p>
            </div>
            {/* Nút hiển thị nhanh */}
            <button
              className="mt-2 w-full rounded-2xl bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-violet-50 hover:text-violet-600"
              onClick={() => alert(`📜 “${item.content}” — ${item.author ?? 'Ẩn danh'} 😊`)}
            >
              🎉 Xem ngay
            </button>
          </>
        ) : (
          <p className="text-center text-sm italic text-slate-400">
            Đang tải danh ngôn… 🍰
          </p>
        )}
      </div>

      {/* Dấu cách xanh mộng mơ dưới widget */}
      <div className="mt-3 h-1 w-full animate-pulse rounded-full bg-gradient-to-r from-fuchsia-300 to-sky-300" />
    </aside>
  );
}
