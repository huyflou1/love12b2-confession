import { useState } from 'react';
import { topicOf } from '../data/mockData.js';
import { moderateText } from '../utils/moderation.js';
import { formatDateTime, timeAgo } from '../utils/share.js';
import ReactionBar from './ReactionBar.jsx';
import ShareModal from './ShareModal.jsx';

/* ================= Icons (inline SVG, không cần lib ngoài) ================= */
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-3.9-.9L3 21l2-5.1a8.4 8.4 0 0 1 7.5-12.9A8.4 8.4 0 0 1 21 11.5z" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
  </svg>
);

/* ================= Card confession ================= */
export default function ConfessionCard({
  confession,
  index,
  rankBadge = false,
  onToggleHeart,
  onReact,
  onUpdateContent,
  onAddComment,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(confession.content);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentAlert, setCommentAlert] = useState(null);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const COMMENT_PREVIEW = 3;

  const topic = topicOf(confession.topic);

  const handleHeart = () => {
    setLiked((v) => !v);
    onToggleHeart(confession.id, !liked);
  };

  const handleSaveEdit = () => {
    const text = draft.trim();
    if (text.length >= 5) {
      onUpdateContent(confession.id, text);
      setIsEditing(false);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    const result = moderateText(`${commentName} ${text}`);
    if (result.level === 'block') {
      setCommentAlert({ type: 'block', message: result.issues[0].message });
      return;
    }
    if (result.level === 'warn') {
      setCommentAlert({ type: 'warn', message: result.issues[0].message });
    } else {
      setCommentAlert(null);
    }
    onAddComment(confession.id, { content: text, author: commentName.trim() || null });
    setCommentText('');
  };

  return (
    <article
      id={`confession-${confession.id}`}
      className="glass-card relative break-inside-avoid p-4 transition duration-300 hover:-translate-y-1 hover:shadow-candy"
    >
      {/* Header card: icon kute + số thứ tự + chủ đề + thời gian */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 text-2xl shadow-sm">
            {confession.icon}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-gradient-to-r from-violet-500 to-sky-400 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                #{index}
              </span>
              {rankBadge && (
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  🔥 Top {index}
                </span>
              )}
              <span className={`chip !cursor-default !px-2 !py-0.5 !text-[11px] ${topic.chipBg}`}>
                {topic.emoji} {topic.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              {confession.author ?? '🕵️ Ẩn danh'} · {timeAgo(confession.createdAt)}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold text-slate-500">
              📅 {formatDateTime(confession.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setDraft(confession.content);
            setIsEditing((v) => !v);
          }}
          title="Chỉnh sửa confession"
          className="rounded-full p-2 text-slate-300 transition hover:bg-fuchsia-50 hover:text-fuchsia-500"
        >
          <PencilIcon />
        </button>
      </div>

      {/* Nội dung */}
      {isEditing ? (
        <div className="mb-3 space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="input-cute resize-none text-sm"
          />
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="btn-gradient !px-3 !py-1.5 text-xs">
              💾 Lưu
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-ghost !px-3 !py-1.5 text-xs">
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
          {confession.content}
        </p>
      )}

      <div className="divider-heart mb-2.5" />

      {/* Tương tác: reactions kute · bình luận · chia sẻ */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
        <ReactionBar
          confession={confession}
          liked={liked}
          onHeart={handleHeart}
          onReact={(rid) => onReact(confession.id, rid)}
        />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowComments((v) => !v)}
            aria-expanded={showComments}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition hover:bg-sky-50 hover:text-sky-500"
          >
            <CommentIcon />
            {confession.comments.length}
          </button>

          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition hover:bg-violet-50 hover:text-violet-500"
          >
            <ShareIcon />
            Chia sẻ
          </button>
        </div>
      </div>

      {/* Modal chia sẻ chuẩn — không còn bị cắt trong Masonry */}
      {showShare && <ShareModal confession={confession} onClose={() => setShowShare(false)} />}



      {/* Bình luận ẩn danh — gọn, cuộn nội bộ, không cắt tràn */}
      {showComments && (
        <div className="mt-3 animate-fadeInUp overflow-hidden rounded-2xl bg-white/60 p-3">
          {confession.comments.length === 0 && (
            <p className="text-center text-xs italic text-slate-400">
              Chưa có bình luận — hãy là người đầu tiên vỗ về 💬
            </p>
          )}
          {confession.comments.length > 0 && (
            <div className="mb-2.5 max-h-56 space-y-2 overflow-y-auto pr-1">
              {(expanded ? confession.comments : confession.comments.slice(-COMMENT_PREVIEW)).map((c) => (
            <div key={c.id} className="flex gap-2">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-sky-100 text-sm">
                🐾
              </span>
              <div className="glass-soft min-w-0 flex-1 px-3 py-2">
                <p className="text-[11px] font-bold text-violet-500">
                  {c.author ?? 'Ẩn danh'}{' '}
                  <span className="font-medium text-slate-400">
                    · 📅 {formatDateTime(c.createdAt)}
                  </span>
                </p>
                <p className="break-words text-sm text-slate-600">{c.content}</p>
              </div>
            </div>
              ))}
            </div>
          )}
          {confession.comments.length > COMMENT_PREVIEW && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mb-2.5 w-full rounded-xl bg-white/70 py-1.5 text-xs font-bold text-violet-500 transition hover:bg-violet-50"
            >
              {expanded
                ? 'Thu gọn ▲'
                : `Xem thêm ${confession.comments.length - COMMENT_PREVIEW} bình luận ▼`}
            </button>
          )}

          <form onSubmit={handleComment} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input
              value={commentName}
              maxLength={20}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Tên (tuỳ chọn)"
              className="input-cute w-full !px-3 !py-2 text-xs"
            />
            <input
              value={commentText}
              maxLength={200}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Bình luận ẩn danh 💬"
              className="input-cute w-full !px-3 !py-2 text-xs"
            />
            <button type="submit" className="btn-gradient w-full !px-4 !py-2 text-xs sm:w-auto">
              Gửi
            </button>
          </form>
          {commentAlert && (
            <p
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                commentAlert.type === 'block'
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {commentAlert.type === 'block' ? '🚫 ' : '⚠️ '}
              {commentAlert.message}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
