import { useState } from 'react';
import { REACTIONS } from '../data/mockData.js';
import { formatCount } from '../utils/share.js';

/**
 * ReactionBar — thay nút Tim đơn thuần bằng 6 cảm xúc kute.
 * - heart: dùng prop hearts/liked đã có (giữ tương thích cũ, hiệu ứng burst).
 * - 5 cảm xúc còn lại: đếm riêng trong confession.reactions, bấm 1 lần = +1.
 */
export default function ReactionBar({ confession, liked, onHeart, onReact }) {
  const [bursts, setBursts] = useState([]);

  const fireBurst = (emoji) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, emoji }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 900);
  };

  return (
    <div className="relative">
      {/* Emoji bay */}
      {bursts.map((b) => (
        <span
          key={b.id}
          className="pointer-events-none absolute -top-6 left-1/2 animate-fadeInUp text-xl"
          style={{ marginLeft: `${(Math.random() - 0.5) * 70}px`, animationDuration: '0.9s' }}
        >
          {b.emoji}
        </span>
      ))}

      <div className="flex flex-wrap items-center gap-1">
        {REACTIONS.map((r) => {
          if (r.id === 'heart') {
            return (
              <button
                key={r.id}
                onClick={() => {
                  if (!liked) fireBurst('💖');
                  onHeart();
                }}
                title="Thả tim"
                aria-label="Thả tim"
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition ${
                  liked ? 'bg-rose-50 text-rose-500' : 'hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                <span className={liked ? 'animate-heartPop' : ''}>{r.emoji}</span>
                <span className="tabular-nums">{formatCount(confession.hearts)}</span>
              </button>
            );
          }
          const value = confession.reactions?.[r.id] ?? 0;
          return (
            <button
              key={r.id}
              onClick={() => {
                fireBurst(r.emoji);
                onReact(r.id);
              }}
              title={r.label}
              aria-label={r.label}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition hover:bg-violet-50 hover:text-violet-600"
            >
              <span>{r.emoji}</span>
              <span className="tabular-nums">{formatCount(value)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
