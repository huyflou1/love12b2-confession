import { useState } from 'react';
import { CUTE_ICONS, TOPICS, topicOf } from '../data/mockData.js';
import { formatCount, formatDateTime, timeAgo } from '../utils/share.js';

/* Password admin — chỉ dùng nội bộ, không hiển thị trong UI */
const ADMIN_PASSWORD = 'huyphuong0508';
const CUTE_ICONS_PREVIEW = CUTE_ICONS;

const TABS = [
  { id: 'overview', label: '📊 Tổng quan' },
  { id: 'confessions', label: '💌 Quản lý confession' },
  { id: 'comments', label: '💬 Bình luận' },
  { id: 'content', label: '🎨 Nội dung trang' },
  { id: 'settings', label: '⚙️ Cài đặt' },
];

/* ============ Tab 1: Tổng quan ============ */
function OverviewTab({ confessions }) {
  const totalHearts = confessions.reduce((s, c) => s + c.hearts, 0);
  const totalComments = confessions.reduce((s, c) => s + c.comments.length, 0);
  const stats = [
    { label: 'Tổng confession', value: confessions.length, emoji: '💌' },
    { label: 'Tổng tim', value: formatCount(totalHearts), emoji: '💖' },
    { label: 'Bình luận', value: totalComments, emoji: '💬' },
    { label: 'Chủ đề', value: TOPICS.length, emoji: '🗂️' },
  ];
  const latest = [...confessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-soft p-4 text-center">
            <p className="text-2xl">{s.emoji}</p>
            <p className="gradient-text mt-1 text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
      {latest && (
        <div className="glass-soft p-4">
          <p className="label-cute">Confession mới nhất</p>
          <p className="text-sm text-slate-600">
            {latest.icon} <strong>{latest.author ?? 'Ẩn danh'}</strong> · 📅 {formatDateTime(latest.createdAt)} —
            “{latest.content.slice(0, 120)}…”
          </p>
        </div>
      )}
    </div>
  );
}

/* ============ Tab 2: Quản lý confession (sửa · xoá · ghim) ============ */
function ConfessionsTab({ confessions, onUpdate, onDelete, onTogglePin, onResetHearts, onRestoreMock }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [topicDraft, setTopicDraft] = useState('love');
  const [query, setQuery] = useState('');

  const filtered = confessions.filter((c) => c.content.toLowerCase().includes(query.toLowerCase()));

  const startEdit = (c) => {
    setEditingId(c.id);
    setDraft(c.content);
    setTopicDraft(c.topic);
  };

  const saveEdit = () => {
    if (draft.trim().length >= 5) {
      onUpdate(editingId, { content: draft.trim(), topic: topicDraft });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Tìm trong nội dung…"
          className="input-cute !w-auto flex-1 !py-2 text-sm"
        />
        <button onClick={onRestoreMock} className="btn-ghost !text-xs">
          ♻️ Khôi phục dữ liệu mẫu
        </button>
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm italic text-slate-400">
          Không tìm thấy confession nào 🐣
        </p>
      )}

      {filtered.map((c) => (
        <div key={c.id} className="glass-soft p-3">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className="rounded-full bg-gradient-to-r from-violet-500 to-sky-400 px-2 py-0.5 text-white">
                #{c.id}
              </span>
              <span className={`chip !cursor-default !px-2 !py-0.5 !text-[11px] ${topicOf(c.topic).chipBg}`}>
                {topicOf(c.topic).emoji} {topicOf(c.topic).label}
              </span>
              <span className="text-slate-400">
                {c.author ?? 'Ẩn danh'} · ❤️ {formatCount(c.hearts)} · 💬 {c.comments.length} ·{' '}
                📅 {formatDateTime(c.createdAt)} ({timeAgo(c.createdAt)})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => onTogglePin(c.id)} className="btn-ghost !px-2.5 !py-1 !text-xs">
                {c.pinned ? 'Bỏ ghim 📌' : 'Ghim 📌'}
              </button>
              <button onClick={() => onResetHearts(c.id)} className="btn-ghost !px-2.5 !py-1 !text-xs">
                Đặt lại ❤️
              </button>
              <button onClick={() => startEdit(c)} className="btn-ghost !px-2.5 !py-1 !text-xs">
                Sửa ✏️
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Bạn chắc chắn muốn xoá confession này?')) onDelete(c.id);
                }}
                className="inline-flex items-center gap-1 rounded-2xl bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-500 transition hover:bg-rose-100"
              >
                XOÁ 🗑️
              </button>
            </div>
          </div>

          {editingId === c.id ? (
            <div className="space-y-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="input-cute resize-none text-sm"
              />
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={topicDraft}
                  onChange={(e) => setTopicDraft(e.target.value)}
                  className="input-cute !w-auto !py-1.5 text-xs"
                >
                  {TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.emoji} {t.label}
                    </option>
                  ))}
                </select>
                <button onClick={saveEdit} className="btn-gradient !px-3 !py-1.5 text-xs">
                  💾 Lưu
                </button>
                <button onClick={() => setEditingId(null)} className="btn-ghost !px-3 !py-1.5 text-xs">
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              {c.pinned && '📌 '}
              {c.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ============ Tab 3: Quản lý bình luận ============ */
function CommentsTab({ confessions, onDeleteComment }) {
  const [openId, setOpenId] = useState(null);
  const withComments = confessions.filter((c) => c.comments.length > 0);

  if (withComments.length === 0) {
    return <p className="py-6 text-center text-sm italic text-slate-400">Chưa có bình luận nào 💬</p>;
  }

  return (
    <div className="space-y-3">
      {withComments.map((c) => (
        <div key={c.id} className="glass-soft p-3">
          <button
            onClick={() => setOpenId(openId === c.id ? null : c.id)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-xs font-bold text-slate-600">
              #{c.id} {c.icon} — {c.comments.length} bình luận
            </span>
            <span className="text-xs font-bold text-violet-500">
              {openId === c.id ? 'Ẩn ▲' : 'Xem ▼'}
            </span>
          </button>
          {openId === c.id && (
            <div className="mt-2 space-y-2">
              {c.comments.map((cm) => (
                <div key={cm.id} className="flex items-start justify-between gap-2 rounded-xl bg-white/70 p-2">
                  <p className="text-sm text-slate-600">
                    <strong className="text-violet-500">{cm.author ?? 'Ẩn danh'}</strong>{' '}
                    <span className="font-medium text-slate-400">
                      · 📅 {formatDateTime(cm.createdAt)}
                    </span>
                    <br />
                    {cm.content}
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Xoá bình luận này?')) onDeleteComment(c.id, cm.id);
                    }}
                    className="shrink-0 rounded-xl bg-rose-50 px-2 py-1 text-xs font-bold text-rose-500 hover:bg-rose-100"
                  >
                    XÓA 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ============ Tab 4: Nội dung trang (hero, footer…) ============ */
function ContentTab({ siteContent, onUpdateContent }) {
  const fields = [
    { key: 'brandName', label: 'Tên thương hiệu (Header)', type: 'input' },
    { key: 'heroTitle', label: 'Tiêu đề cảm xúc (Composer)', type: 'input' },
    { key: 'heroSubtitle', label: 'Phụ đề bên dưới tiêu đề', type: 'input' },
    { key: 'footerPrivacy', label: 'Điều khoản bảo mật (Footer)', type: 'textarea' },
    { key: 'footerPromise', label: 'Cam kết ẩn danh (Footer)', type: 'textarea' },
  ];

  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="label-cute">{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={siteContent[f.key]}
              rows={3}
              onChange={(e) => onUpdateContent({ [f.key]: e.target.value })}
              className="input-cute resize-none text-sm"
            />
          ) : (
            <input
              value={siteContent[f.key]}
              onChange={(e) => onUpdateContent({ [f.key]: e.target.value })}
              className="input-cute text-sm"
            />
          )}
        </div>
      ))}
      <p className="rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-600">
        ✅ Mọi thay đổi được áp dụng NGAY LẬP TỨC trên trang — rất trực quan phải không?
      </p>
    </div>
  );
}

/* ============ Tab 5: Cài đặt (tổng quan chủ đề & icon) ============ */
function SettingsTab({ confessions }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="label-cute">Chủ đề đang hoạt động</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const count = confessions.filter((c) => c.topic === t.id).length;
            return (
              <span key={t.id} className={`chip !cursor-default ${t.chipBg}`}>
                {t.emoji} {t.label} · {count}
              </span>
            );
          })}
        </div>
      </div>
      <div>
        <p className="label-cute">Bộ icon kute (tự gán ngẫu nhiên cho confession mới)</p>
        <div className="flex flex-wrap gap-1.5 text-2xl">
          {CUTE_ICONS_PREVIEW.map((ic) => (
            <span key={ic} className="glass-soft px-2 py-1">
              {ic}
            </span>
          ))}
        </div>
      </div>
      <div className="glass-soft p-3 text-xs font-semibold text-slate-500">
        🔐 Bảo mật: phiên admin chỉ tồn tại trong RAM trình duyệt, không lưu token. Mật khẩu không
        bao giờ được hiển thị trên giao diện.
      </div>
    </div>
  );
}


/* ============ Component chính: Control Panel cho Admin ============
 * NOTE: AdminPage.jsx bọc component này trong trang riêng (#/admin).
 * Mật khẩu KHÔNG BAO GIỜ được render ra UI.
 */
export function AdminLoginGate({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError('');
      setPassword(''); // xoá mật khẩu khỏi bộ nhớ component ngay sau khi đăng nhập
    } else {
      setError('Mật khẩu không đúng rồi 🙈 Thêu lại nhé!');
      setPassword('');
    }
  };

  /* ---------- Chưa đăng nhập: form login (mật khẩu KHÔNG BAO GIỜ hiện lên panel) ---------- */
  if (!loggedIn) {
    return (
      <section className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 px-5 py-3 text-white">
          <h2 className="text-base font-bold sm:text-lg">🛡️ Bảng điều khiển Admin</h2>
          <p className="text-xs text-white/90">Chỉ dành cho quản trị viên Love12B2</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-3 p-5">
          <div>
            <label className="label-cute">Mật khẩu quản trị</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                className="input-cute !pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500"
                aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <p className="text-xs font-bold text-rose-500">{error}</p>}
          <button type="submit" className="btn-gradient w-full">
            🔓 Đăng nhập
          </button>
        </form>
      </section>
    );
  }

  /* ---------- Đã đăng nhập: render trang quản trị (children = AdminDashboard) ---------- */
  if (loggedIn) return children({ onLogout: () => setLoggedIn(false) });

  // Dự phòng: không bao giờ tới đây vì đã return ở trên
  return null;
}

/* ============ Dashboard quản trị full-width (dùng trong trang Admin riêng) ============ */
export function AdminDashboard({
  confessions,
  siteContent,
  onUpdateConfession,
  onDeleteConfession,
  onTogglePin,
  onResetHearts,
  onDeleteComment,
  onUpdateSiteContent,
  onRestoreMock,
  onClearAll,
  onLogout,
  onGoHome,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-5">
      {/* Thanh tiêu đề trang quản trị */}
      <div className="glass-card flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 !border-transparent p-5 text-white shadow-candy sm:p-6">
        <div>
          <h2 className="text-xl font-bold drop-shadow-sm sm:text-2xl">🛠️ Control Panel</h2>
          <p className="text-xs text-white/90 sm:text-sm">
            Quản lý toàn bộ nội dung Love12B2 · linh hoạt chuyển đổi các tab bên dưới
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onGoHome}
            className="rounded-2xl bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md transition hover:bg-white/30"
          >
            🏠 Về trang chủ
          </button>
          <button
            onClick={onLogout}
            className="rounded-2xl bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md transition hover:bg-white/30"
          >
            Đăng xuất 🚪
          </button>
        </div>
      </div>

      {/* Điều hướng tab — sidebar trên desktop, cuộn ngang trên mobile */}
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="glass-card flex gap-1.5 overflow-x-auto p-2 lg:flex-col lg:overflow-visible lg:p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`chip !whitespace-nowrap !px-3 !py-2.5 !text-sm lg:!justify-start ${
                activeTab === t.id
                  ? 'border-transparent bg-gradient-to-r from-violet-500 to-sky-400 text-white shadow-candy'
                  : 'border-white/70 bg-white/60 text-slate-600 hover:-translate-y-0.5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="glass-card min-w-0 p-4 sm:p-5">
          {activeTab === 'overview' && <OverviewTab confessions={confessions} />}
          {activeTab === 'confessions' && (
            <ConfessionsTab
              confessions={confessions}
              onUpdate={onUpdateConfession}
              onDelete={onDeleteConfession}
              onTogglePin={onTogglePin}
              onResetHearts={onResetHearts}
              onRestoreMock={onRestoreMock}
            />
          )}
          {activeTab === 'comments' && (
            <CommentsTab confessions={confessions} onDeleteComment={onDeleteComment} />
          )}
          {activeTab === 'content' && (
            <ContentTab siteContent={siteContent} onUpdateContent={onUpdateSiteContent} />
          )}
          {activeTab === 'settings' && <SettingsTab confessions={confessions} />}

          {/* Khu vực nguy hiểm — xoá toàn bộ */}
          {activeTab === 'settings' && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-3">
              <p className="text-xs font-bold text-rose-600">⚠️ Vùng nguy hiểm</p>
              <p className="mb-2 text-xs text-rose-500">Xoá TOÀN BỘ confession — không thể hoàn tác.</p>
              <button
                onClick={() => {
                  if (window.confirm('Xác nhận xoá toàn bộ confession?')) onClearAll();
                }}
                className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-600"
              >
                🗑️ XOÁ TOÀN BỘ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


