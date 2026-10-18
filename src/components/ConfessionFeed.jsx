import { useMemo, useState } from 'react';
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
    title: '🏆 Top 5 confession nhiều tim nhất',
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
 * Mặc định hiển thị 5 confession nhiều tim nhất, có tab Bài viết mới nhất & bộ lọc chủ đề.
 */
export default function ConfessionFeed({ confessions, onToggleHeart, onReact, onUpdateContent, onAddComment }) {
  const [filter, setFilter] = useState('top');

  const visible = useMemo(() => {
    const list = [...confessions];
    if (filter === 'top') {
      return list
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return (b.hearts || 0) - (a.hearts || 0);
        })
        .slice(0, 5);
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

  const activeTopic = TOPICS.find((t) => t.id === filter);
  const headerInfo = HEADER_META[filter] || {
    title: `${activeTopic?.emoji || '💖'} Chủ đề: ${activeTopic?.label || ''}`,
    subtitle: 'Những lời tâm sự cùng tần số cảm xúc với cậu 🌸',
  };

  return (
    <section>
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
              onClick={() => setFilter(f.id)}
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
        <div className="masonry columns-1 gap-5 md:columns-2 xl:columns-3">
          {visible.map((c, i) => (
            <ConfessionCard
              key={c.id}
              confession={c}
              index={i + 1}
              rankBadge={filter === 'top'}
              onToggleHeart={onToggleHeart}
              onReact={onReact}
              onUpdateContent={onUpdateContent}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}
    </section>
  );
}
