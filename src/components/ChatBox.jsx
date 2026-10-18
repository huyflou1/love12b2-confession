import { useEffect, useRef, useState } from 'react';
import { sendChatMessage, subscribeChat } from '../lib/chatStore.js';
import { isOnlineMode } from '../lib/confessionStore.js';
import { activeMessages, CHAT_MAX_LENGTH } from '../utils/chat.js';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(isOnlineMode() ? 'Đang kết nối…' : 'Chưa cấu hình Firebase');
  const [now, setNow] = useState(Date.now);
  const listRef = useRef(null);
  const followRef = useRef(true);
  const visible = activeMessages(messages, now);

  useEffect(() => {
    const unsubscribe = subscribeChat((items, fromServer) => {
      setMessages(items);
      setStatus(fromServer ? 'Đã đồng bộ' : 'Dữ liệu bộ nhớ đệm');
      setError('');
    }, () => {
      setStatus('Mất kết nối');
      setError('Không đọc được chat. Hãy kiểm tra kết nối và Firestore rules.');
    });
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { unsubscribe(); clearInterval(timer); };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list && followRef.current) list.scrollTop = list.scrollHeight;
  }, [messages, visible.length]);

  const submit = async (event) => {
    event.preventDefault();
    if (sending || !content.trim()) return;
    setSending(true);
    setError('');
    const draft = content;
    try {
      await sendChatMessage({ author, content: draft });
      setContent((current) => current === draft ? '' : current);
      followRef.current = true;
    } catch (err) {
      setError(err.code ? 'Chưa gửi được tin. Kiểm tra mạng/quyền truy cập rồi thử lại nhé.' : err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="glass-card min-w-0 overflow-hidden" aria-labelledby="chat-title">
      <div className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400 p-4 text-white">
        <h2 id="chat-title" className="text-lg font-bold">💬 Góc tám chuyện kute</h2>
        <p className="text-xs">🌷 {status} · 100 tin gần nhất · lưu 15 ngày</p>
      </div>
      <div ref={listRef} role="log" aria-label="Tin nhắn trò chuyện" aria-live="polite"
        onScroll={(event) => {
          const list = event.currentTarget;
          followRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 48;
        }}
        className="h-80 space-y-3 overflow-y-auto overscroll-contain p-4">
        {visible.length === 0 && <p className="py-12 text-center text-sm text-slate-400">🐣 Chưa có tin nhắn. Gửi lời chào đầu tiên nhé!</p>}
        {visible.map((message) => (
          <article key={message.id} className="rounded-2xl rounded-tl-sm border border-pink-100 bg-white/80 p-3">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <strong className="break-all text-violet-600">🧸 {message.author}</strong>
              <time className="text-slate-400" dateTime={message.createdAt ? new Date(message.createdAt).toISOString() : undefined}>
                {message.createdAt ? new Date(message.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Đang gửi…'}
              </time>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{message.content}</p>
          </article>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-2 border-t border-pink-100 p-4">
        <label className="sr-only" htmlFor="chat-author">Bút danh</label>
        <input id="chat-author" className="input-cute !py-2" placeholder="Bút danh (không bắt buộc) 🐾" maxLength={30} value={author} onChange={(event) => setAuthor(event.target.value)} />
        <label className="sr-only" htmlFor="chat-content">Tin nhắn</label>
        <textarea id="chat-content" className="input-cute min-h-20 resize-y" placeholder="Một lời chào dễ thương… 💌" maxLength={CHAT_MAX_LENGTH} value={content} onChange={(event) => setContent(event.target.value)} />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">{content.length}/{CHAT_MAX_LENGTH}</span>
          <button type="submit" disabled={sending || !content.trim() || !isOnlineMode()} className="btn-gradient !px-4 !py-2 text-xs">{sending ? 'Đang gửi…' : 'Gửi lời thương 💗'}</button>
        </div>
        {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}
        <p className="text-[11px] text-slate-400">Chat công khai — đừng chia sẻ thông tin riêng tư nhé. Tin hết 15 ngày sẽ được ẩn.</p>
      </form>
    </section>
  );
}