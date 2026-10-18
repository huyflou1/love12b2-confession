import { useEffect, useState } from 'react';

/**
 * OnlineCounter — đếm số người online ngay trên Header.
 * Demo mode: mô phỏng dao động ngẫu nhiên quanh mốc ban đầu
 * (khi có backend thật, thay bằng websocket/polling API).
 */
export default function OnlineCounter() {
  const [count, setCount] = useState(() => 28 + Math.floor(Math.random() * 36));
  const [trend, setTrend] = useState(0);

  useEffect(() => {
    const tick = () => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3..+3
        const next = Math.min(180, Math.max(12, c + delta));
        setTrend(next === c ? 0 : next > c ? 1 : -1);
        return next;
      });
    };
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="glass-soft inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600"
      title="Số người đang xem trang (cập nhật trực tiếp)"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="tabular-nums">🟢 {count} online</span>
      <span className="hidden text-emerald-400 sm:inline">
        {trend > 0 ? '▲' : trend < 0 ? '▼' : '•'}
      </span>
    </span>
  );
}
