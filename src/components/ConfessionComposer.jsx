import { useMemo, useState } from 'react';
import { CUTE_ICONS, TOPICS } from '../data/mockData.js';
import { moderateText } from '../utils/moderation.js';

const MAX_LEN = 500;

/**
 * ConfessionComposer — khung nhập tin nhắn ẩn danh.
 * Bao gồm: tiêu đề cảm xúc, chọn chủ đề, nickname tuỳ chọn, gửi ẩn danh.
 */
export default function ConfessionComposer({ onSubmit, heroTitle, heroSubtitle }) {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('love');
  const [alias, setAlias] = useState('');
  const [stayAnonymous, setStayAnonymous] = useState(true);
  const [shake, setShake] = useState(false);

  // Kiểm duyệt văn minh theo thời gian thực
  const verdict = useMemo(() => moderateText(`${alias} ${content}`), [alias, content]);

  const previewIcon = useMemo(() => {
    const hash = (content.length + content.charCodeAt(0 || 0)) % CUTE_ICONS.length;
    return CUTE_ICONS[hash];
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = content.trim();
    if (text.length < 5) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    // Auto moderation: block nếu lộ thông tin nhạy cảm
    if (verdict.level === 'block') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSubmit({
      content: text,
      topic,
      author: stayAnonymous ? null : alias.trim() || 'Ẩn danh 🌙',
    });
    setContent('');
    setAlias('');
    setStayAnonymous(true);
    setTopic('love');
  };

  return (
    <section className="glass-card overflow-hidden">
      {/* Đầu khung: gradient tím -> xanh mộng mơ */}
      <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 px-5 py-4 text-white">
        <h2 className="text-lg font-bold drop-shadow-sm sm:text-xl">💌 {heroTitle}</h2>
        <p className="mt-0.5 text-xs font-medium text-white/90">{heroSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {/* Chọn chủ đề */}
        <div>
          <span className="label-cute">Chọn chủ đề</span>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopic(t.id)}
                aria-pressed={topic === t.id}
                className={`chip ${
                  topic === t.id
                    ? 'border-transparent bg-gradient-to-r from-violet-500 to-sky-400 text-white shadow-candy'
                    : `${t.chipBg} hover:-translate-y-0.5`
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nhập nội dung */}
        <div className={shake ? 'animate-[heartPop_0.5s]' : ''}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="label-cute !mb-0">Lời confession</span>
            <span
              className={`text-xs font-semibold ${
                content.length > MAX_LEN - 50 ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {content.length}/{MAX_LEN}
            </span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-3 text-2xl">{previewIcon}</span>
            <textarea
              value={content}
              maxLength={MAX_LEN}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Những điều bạn chưa dám nói… (hoàn toàn ẩn danh nha 🤫)"
              rows={5}
              className="input-cute resize-none !pl-12 leading-relaxed"
            />
          </div>
          {shake && (
            <p className="mt-1 text-xs font-semibold text-rose-500">
              {verdict.level === 'block'
                ? `🚫 ${verdict.issues[0].message}`
                : 'Oops! Hãy viết ít nhất 5 ký tự để gửi đi 💦'}
            </p>
          )}
          {/* Cảnh báo nhẹ khi phát hiện từ ngữ toxic — vẫn cho gửi */}
          {!shake && verdict.level === 'warn' && (
            <p className="mt-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-600">
              ⚠️ {verdict.issues[0].message} Bạn vẫn có thể gửi, nhưng hãy dịu dàng hơn nhé 💗
            </p>
          )}
        </div>

        {/* Tên hiển thị tuỳ chọn */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="label-cute !mb-0">Xuất hiện với tư cách</span>
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500">
              <input
                type="checkbox"
                checked={stayAnonymous}
                onChange={(e) => setStayAnonymous(e.target.checked)}
                className="peer sr-only"
              />
              <span className="relative h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-gradient-to-r peer-checked:from-violet-500 peer-checked:to-sky-400 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
              {stayAnonymous ? 'Ẩn danh 100%' : 'Điền tên'}
            </label>
          </div>
          {stayAnonymous ? (
            <p className="input-cute !py-2.5 text-sm italic text-slate-400">
              🕵️ Không ai biết bạn là ai — kể cả admin
            </p>
          ) : (
            <input
              value={alias}
              maxLength={24}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Vd: Mèo ú, Cún vàng, Bạn bí ẩn…"
              className="input-cute"
            />
          )}
        </div>

        <button type="submit" className="btn-gradient w-full !py-3 text-base">
          🚀 Gửi ẩn danh
        </button>
        <p className="text-center text-[11px] font-medium text-slate-400">
          Bằng việc gửi, bạn đồng ý với Điều khoản bảo mật 💗
        </p>
      </form>
    </section>
  );
}
