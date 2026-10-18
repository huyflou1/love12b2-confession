import { useEffect, useState } from 'react';
import { copyToClipboard } from '../utils/share.js';

const QUOTES = [
  {
    emoji: '🌸',
    text: 'Thanh xuân giống như một cơn mưa rào, dù cho bạn từng bị cảm lạnh vì tắm mưa thì bạn vẫn muốn được đắm mình trong cơn mưa ấy lần nữa.',
    author: 'Cửu Bả Đao',
    tag: 'Thanh xuân',
  },
  {
    emoji: '💌',
    text: 'Có những điều chưa kịp nói ra đã thành kỷ niệm, nhưng chính vì chưa nói nên mới đẹp mãi trong tim.',
    author: 'Love12B2',
    tag: 'Tình yêu',
  },
  {
    emoji: '🌈',
    text: 'Sau cơn mưa trời lại sáng. Đừng buồn vì hôm nay mỏi mệt, ngày mai nắng ấm vẫn dịu dàng đợi cậu ở cuối con đường.',
    author: 'Khuyết danh',
    tag: 'Chữa lành',
  },
  {
    emoji: '📚',
    text: 'Ba năm cấp ba tưởng dài đằng đẵng, ngoảnh đầu lại chỉ vừa bằng một cái chớp mắt và một tấm ảnh tốt nghiệp.',
    author: 'Hồi ức 12B2',
    tag: 'Học đường',
  },
  {
    emoji: '✨',
    text: 'Cậu không cần phải hoàn hảo mới xứng đáng được yêu thương. Chính sự dịu dàng và chân thành của cậu đã là món quà rồi.',
    author: 'Góc nhỏ bình yên',
    tag: 'Động lực',
  },
  {
    emoji: '🍀',
    text: 'Hạnh phúc không phải là đích đến, mà là những buổi chiều tan học cùng lũ bạn ăn vặt và cười vang cả góc phố.',
    author: 'Nhật ký tuổi 18',
    tag: 'Cuộc sống',
  },
  {
    emoji: '🌙',
    text: 'Nếu hôm nay có ai đó làm cậu buồn, hãy gửi nỗi buồn ấy vào gió và giữ lại cho mình một nụ cười thật xinh nhé.',
    author: 'Radio Đêm',
    tag: 'Tâm sự',
  },
  {
    emoji: '🧁',
    text: 'Người thích cậu sẽ luôn tìm lý do để ở cạnh cậu, giống như nắng mùa thu chẳng bao giờ quên ghé qua khung cửa lớp.',
    author: 'Trạm Thương',
    tag: 'Ngọt ngào',
  },
  {
    emoji: '🕊️',
    text: 'Mỗi ước mơ lớn đều bắt đầu từ một hạt mầm nhỏ. Cố lên nhé sĩ tử 12B2, cánh cổng đại học đang chờ đón các cậu!',
    author: 'Love12B2',
    tag: 'Ước mơ',
  },
  {
    emoji: '🧸',
    text: 'Đôi khi chỉ một lời hỏi thăm ẩn danh cũng đủ sưởi ấm cả một ngày dài lạnh giá của ai đó.',
    author: 'Hộp thư bí mật',
    tag: 'Sẻ chia',
  },
];

/**
 * RandomConfessionWidget — Widget danh ngôn ngẫu nhiên bất kỳ ở cột bên hông.
 * Tự động đổi câu mới hoặc bấm nút để xoay ngẫu nhiên / sao chép.
 */
export default function RandomConfessionWidget({ className = '' }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const pickRandom = () => {
    setIndex((prev) => {
      if (QUOTES.length <= 1) return 0;
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * QUOTES.length);
      }
      return next;
    });
  };

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setIndex((c) => (c + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [paused]);

  const quote = QUOTES[index] || QUOTES[0];

  const handleCopy = async () => {
    const ok = await copyToClipboard(`“${quote.text}” — ${quote.author}`);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <aside
      className={`glass-card overflow-hidden p-5 transition-all duration-300 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header của widget */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-violet-400 to-sky-400 text-xl text-white shadow-candy">
            {quote.emoji}
          </span>
          <div>
            <h3 className="gradient-text text-base font-bold">✨ Danh ngôn ngẫu nhiên</h3>
            <p className="text-[11px] font-medium text-slate-400">
              Một chút dịu dàng cho ngày mới 💗
            </p>
          </div>
        </div>
        <span className="rounded-full bg-violet-100/80 px-2.5 py-1 text-[11px] font-bold text-violet-600">
          #{quote.tag}
        </span>
      </div>

      {/* Nội dung danh ngôn */}
      <div className="glass-soft relative p-4">
        <span className="pointer-events-none select-none font-serif text-3xl leading-none text-pink-300">
          “
        </span>
        <p className="mt-0.5 text-sm font-semibold leading-relaxed text-slate-700">
          {quote.text}
        </p>
        <p className="mt-2.5 text-right text-xs font-bold text-violet-500">
          — {quote.author}
        </p>
      </div>

      {/* Các nút tương tác */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={pickRandom}
          className="btn-gradient flex-1 !py-2 text-xs"
        >
          🎲 Đổi danh ngôn khác
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-2xl border border-white/80 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-violet-600"
          title="Sao chép danh ngôn"
        >
          {copied ? '✅ Đã chép' : '📋 Chép'}
        </button>
      </div>

      {/* Dots chỉ báo */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Danh ngôn ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? 'w-5 bg-gradient-to-r from-pink-400 to-sky-400'
                : 'w-1.5 bg-slate-300/70 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </aside>
  );
}

