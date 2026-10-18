import { useEffect, useMemo, useRef, useState } from 'react';
import { PAGE_SIZE, paginate } from '../utils/pagination.js';
import { parseHashTarget } from '../utils/shortlink.js';
import { TOPICS } from '../data/mockData.js';
import ConfessionCard from './ConfessionCard.jsx';

const FILTERS = [
  { id: 'top', label: 'Nhiều tim nhất', emoji: '🏆' },
  { id: 'latest', label: 'Bài viết mới nhất', emoji: '🕒' },
  { id: 'all', label: 'Tất cả', emoji: '✨' },
  ...TOPICS.map((t) => ({ id: t.id, label: t.label, emoji: t.emoji })),
];

const HEADER_META = {
  top: {
    title: '🏆 Confession nhiều tim nhất',
    subtitle: 'Những lời chia sẻ được cả lớp vỗ về nhiều nhất 💗',
  },
  latest: {
    title: '🕒 Bài viết mới nhất',
    subtitle: 'Những tâm sự vừa được gửi lên tức thì — nóng hổi vừa thổi vừa đọc ✨',
  },
  all: {
    title: '✨ Tất cả confession',
    subtitle: 'Toàn bộ những câu chuyện ẩn danh của đại gia đình 12B2 💌',
  },
};

/**
 * ConfessionFeed — lưới Masonry (1 → 2 → 3 cột tuỳ màn hình).
 * Phân trang 20 bài cho mọi bộ lọc; giữ nguyên deep link đến bài viết.
 */
export default function ConfessionFeed({ confessions, onToggleHeart, onReact, onUpdateContent, onAddComment }) {
  const [filter, setFilter] = useState('top');
  const [page, setPage] = useState(1);
  const sectionRef = useRef(null);

  const visible = useMemo(() => {
    const list = [...confessions];
    if (filter === 'top') {
      return list
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return (b.hearts || 0) - (a.hearts || 0);
        });
    }
    if (filter === 'latest') {
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    const byHearts = list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (b.hearts || 0) - (a.hearts || 0);
    });
    if (filter === 'all') return byHearts;
    return byHearts.filter((c) => c.topic === filter);
  }, [confessions, filter]);

  const pagination = paginate(visible, page);
  useEffect(() => {
    setPage(pagination.page);
  }, [pagination.page]);

  useEffect(() => {
    const focusTarget = () => {
      const target = parseHashTarget();
      if (!target) return;
      const index = visible.findIndex((item) => String(item.id) === String(target.id));
      if (index >= 0) {
        const targetPage = Math.floor(index / PAGE_SIZE) + 1;
        setPage(targetPage);
      } else if (confessions.some((item) => String(item.id) === String(target.id))) {
        setFilter('all');
      }
    };
    focusTarget();
    window.addEventListener('hashchange', focusTarget);
    return () => window.removeEventListener('hashchange', focusTarget);
  }, [confessions, visible]);

  useEffect(() => {
    const target = parseHashTarget();
    if (!target) return undefined;
    const timer = setTimeout(() => {
      const element = document.getElementById(`confession-${target.id}`);
      element?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }, 100);
    return () => clearTimeout(timer);
  }, [filter, pagination.page]);

  const changePage = (next) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const activeTopic = TOPICS.find((t) => t.id === filter);
  const headerInfo = HEADER_META[filter] || {
    title: `${activeTopic?.emoji || '💖'} Chủ đề: ${activeTopic?.label || ''}`,
    subtitle: 'Những lời tâm sự cùng tần số cảm xúc với cậu 🌸',
  };

  return (
    <section ref={sectionRef} className="scroll-mt-24">
      {/* Tiêu đề + bộ lọc */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="gradient-text text-xl font-bold sm:text-2xl">
            {headerInfo.title}
          </h2>
          <p className="text-xs font-medium text-slate-500">
            {headerInfo.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setPage(1); }}
              className={`chip !px-3 !py-1 !text-xs ${
                filter === f.id
                  ? 'border-transparent bg-gradient-to-r from-violet-500 to-sky-400 text-white shadow-candy'
                  : 'border-white/70 bg-white/60 text-slate-600 backdrop-blur-md hover:-translate-y-0.5'
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      {visible.length === 0 ? (
        <div className="glass-card p-10 text-center text-slate-400">
          <p className="text-4xl">🐤</p>
          <p className="mt-2 font-semibold">Chưa có confession nào ở chủ đề này…</p>
        </div>
      ) : (
        <div key={`${filter}-${pagination.page}`} className="feed-page masonry columns-1 gap-5 md:columns-2 xl:columns-3">
          {pagination.items.map((c, i) => (
            <ConfessionCard
              key={c.id}
              confession={c}
              index={pagination.offset + i + 1}
              rankBadge={filter === 'top'}
              onToggleHeart={onToggleHeart}
              onReact={onReact}
              onUpdateContent={onUpdateContent}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}
      {visible.length > 0 && (
        <nav aria-label="Phân trang confession" className="glass-soft mt-4 flex flex-wrap items-center justify-center gap-2 p-3">
          <p aria-live="polite" className="w-full text-center text-xs text-slate-500">
            {pagination.offset + 1}–{Math.min(pagination.offset + PAGE_SIZE, visible.length)} / {visible.length} confession · Trang {pagination.page}/{pagination.totalPages}
          </p>
          <button type="button" className="btn-ghost disabled:opacity-40" disabled={pagination.page === 1} onClick={() => changePage(pagination.page - 1)}>← Trước</button>
          {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
            .filter((number) => number === 1 || number === pagination.totalPages || Math.abs(number - pagination.page) <= 1)
            .map((number, index, pages) => (
              <span key={number} className="inline-flex items-center gap-2">
                {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
                <button type="button" aria-label={`Trang ${number}`} aria-current={pagination.page === number ? 'page' : undefined}
                  className={pagination.page === number ? 'btn-gradient !px-3 !py-2 text-sm' : 'btn-ghost'} onClick={() => changePage(number)}>{number}</button>
              </span>
            ))}
          <button type="button" className="btn-ghost disabled:opacity-40" disabled={pagination.page === pagination.totalPages} onClick={() => changePage(pagination.page + 1)}>Sau →</button>
        </nav>
      )}
    </section>
  );
}
