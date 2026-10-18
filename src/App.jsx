import { useCallback, useEffect, useMemo, useState } from 'react';
import ConfessionComposer from './components/ConfessionComposer.jsx';
import ConfessionFeed from './components/ConfessionFeed.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import AdminPage from './pages/AdminPage.jsx';
import RandomConfessionWidget from './components/RandomConfessionWidget.jsx';
import { CUTE_ICONS, DEFAULT_SITE_CONTENT, MOCK_CONFESSIONS, emptyReactions, seedReactions } from './data/mockData.js';
import {
  addCommentOnline,
  bumpHeartsOnline,
  bumpReactionOnline,
  clearAllOnline,
  createConfessionOnline,
  deleteCommentOnline,
  deleteConfessionOnline,
  isOnlineMode,
  subscribeConfessions,
  togglePinOnline,
  updateConfessionOnline,
} from './lib/confessionStore.js';
import { isFirebaseConfigured } from './lib/firebase.js';
import { parseHashTarget } from './utils/shortlink.js';

const STORAGE_KEY = 'love12b2_confessions_v1';

/** Chuẩn hoá 1 confession: đảm bảo có reactions (migrate dữ liệu cũ/mock) */
const withReactions = (c) =>
  c.reactions ? c : { ...c, reactions: seedReactions(c.hearts || 0) };

/** Đọc state từ localStorage (demo mode — không gửi lên server) */
const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.confessions)) {
        return {
          ...parsed,
          confessions: parsed.confessions.map(withReactions),
          siteContent: { ...DEFAULT_SITE_CONTENT, ...(parsed.siteContent || {}) },
        };
      }
    }
  } catch {
    /* bỏ qua dữ liệu hỏng */
  }
  return {
    confessions: MOCK_CONFESSIONS.map(withReactions),
    siteContent: DEFAULT_SITE_CONTENT,
  };
};

export default function App() {
  const [state, setState] = useState(loadInitial);
  const { confessions, siteContent } = state;

  /* Chế độ online (Firebase) hay demo local */
  const [online, setOnline] = useState(() => isFirebaseConfigured);
  const [syncError, setSyncError] = useState('');
  const [syncing, setSyncing] = useState(false);

  /* Bật realtime Firestore khi đã cấu hình: ai gửi là mọi máy thấy ngay */
  useEffect(() => {
    if (!isOnlineMode()) {
      setOnline(false);
      return;
    }
    setOnline(true);
    const unsub = subscribeConfessions(
      (list) => {
        setState((s) => ({ ...s, confessions: list.map(withReactions) }));
        setSyncError('');
      },
      (err) => {
        console.error('[Love12B2] Firestore sync lỗi:', err);
        setSyncError('Không đồng bộ được dữ liệu online — đang dùng dữ liệu local.');
        setOnline(false);
      }
    );
    return () => unsub();
  }, []);

  /* Định tuyến hash đơn giản: '' → trang chủ, '#/admin' → trang quản trị riêng */
  const [route, setRoute] = useState(() =>
    window.location.hash.startsWith('#/admin') ? 'admin' : 'home'
  );

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith('#/admin')) setRoute('admin');
      else if (window.location.hash.startsWith('#c/') || window.location.hash.startsWith('#confession-')) {
        setRoute('home'); // deep-link bài viết: ở trang chủ, effect bên dưới sẽ cuộn
      } else setRoute('home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goAdmin = useCallback(() => {
    window.location.hash = '#/admin';
    setRoute('admin');
    window.scrollTo({ top: 0 });
  }, []);

  const goHome = useCallback(() => {
    // xoá hash admin nhưng giữ nguyên nếu đang là deep-link bài viết
    if (window.location.hash.startsWith('#/admin')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* Persist demo data (chỉ khi ở chế độ local) */
  useEffect(() => {
    if (isOnlineMode()) return; // online: Firestore là nguồn sự thật duy nhất
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage đầy hoặc bị chặn — không quan trọng với demo */
    }
  }, [state]);

  /* ============ Hành động trên confession (online → Firestore, offline → local) ============ */
  const addConfession = useCallback(({ content, topic, author }) => {
    const icon = CUTE_ICONS[Math.floor(Math.random() * CUTE_ICONS.length)];
    if (isOnlineMode()) {
      setSyncing(true);
      createConfessionOnline({ content, topic, author, icon })
        .catch((err) => {
          console.error('[Love12B2] Gửi confession lỗi:', err);
          setSyncError('Gửi bài thất bại — kiểm tra mạng / Firestore rules nhé.');
        })
        .finally(() => setSyncing(false));
      return; // realtime listener sẽ tự thêm bài mới vào feed
    }
    setState((s) => {
      const next = {
        id: Date.now(),
        author,
        topic,
        icon,
        content,
        hearts: 0,
        reactions: emptyReactions(),
        pinned: false,
        createdAt: new Date().toISOString(),
        comments: [],
      };
      return { ...s, confessions: [next, ...s.confessions] };
    });
  }, []);

  const toggleHeart = useCallback((id, liked) => {
    if (isOnlineMode()) {
      bumpHeartsOnline(id, liked ? 1 : -1).catch((err) => {
        console.error('[Love12B2] Thả tim lỗi:', err);
        setSyncError('Thả tim thất bại — thử lại nhé.');
      });
      // lạc quan: cập nhật UI ngay, realtime sẽ đồng bộ lại
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) =>
        c.id === id ? { ...c, hearts: Math.max(0, c.hearts + (liked ? 1 : -1)) } : c
      ),
    }));
  }, []);

  const addReaction = useCallback((id, reactionId) => {
    if (isOnlineMode()) {
      bumpReactionOnline(id, reactionId).catch((err) =>
        console.error('[Love12B2] Reaction lỗi:', err)
      );
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) =>
        c.id === id && c.reactions && reactionId in c.reactions
          ? { ...c, reactions: { ...c.reactions, [reactionId]: c.reactions[reactionId] + 1 } }
          : c
      ),
    }));
  }, []);

  const updateConfessionContent = useCallback((id, content) => {
    if (isOnlineMode()) {
      updateConfessionOnline(id, { content }).catch((err) =>
        console.error('[Love12B2] Sửa bài lỗi:', err)
      );
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, content } : c)),
    }));
  }, []);

  const addComment = useCallback((id, comment) => {
    if (isOnlineMode()) {
      addCommentOnline(id, comment).catch((err) => {
        console.error('[Love12B2] Bình luận lỗi:', err);
        setSyncError('Gửi bình luận thất bại — thử lại nhé.');
      });
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) =>
        c.id === id
          ? {
              ...c,
              comments: [
                ...c.comments,
                {
                  id: Date.now() + Math.floor(Math.random() * 1000),
                  createdAt: new Date().toISOString(),
                  ...comment,
                },
              ],
            }
          : c
      ),
    }));
  }, []);

  /* ============ Hành động của Admin ============ */
  const adminUpdateConfession = useCallback((id, patch) => {
    if (isOnlineMode()) {
      updateConfessionOnline(id, patch).catch((err) =>
        console.error('[Love12B2] Admin sửa lỗi:', err)
      );
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const adminDeleteConfession = useCallback((id) => {
    if (isOnlineMode()) {
      deleteConfessionOnline(id).catch((err) =>
        console.error('[Love12B2] Admin xoá lỗi:', err)
      );
    }
    setState((s) => ({ ...s, confessions: s.confessions.filter((c) => c.id !== id) }));
  }, []);

  const adminTogglePin = useCallback(
    (id) => {
      const target = confessions.find((c) => c.id === id);
      if (isOnlineMode()) {
        togglePinOnline(id, !(target?.pinned ?? false)).catch((err) =>
          console.error('[Love12B2] Ghim bài lỗi:', err)
        );
      }
      setState((s) => ({
        ...s,
        confessions: s.confessions.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
      }));
    },
    [confessions]
  );

  const adminResetHearts = useCallback((id) => {
    if (isOnlineMode()) {
      updateConfessionOnline(id, { hearts: 0 }).catch((err) =>
        console.error('[Love12B2] Reset tim lỗi:', err)
      );
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, hearts: 0 } : c)),
    }));
  }, []);

  const adminDeleteComment = useCallback((confessionId, commentId) => {
    if (isOnlineMode()) {
      deleteCommentOnline(confessionId, commentId).catch((err) =>
        console.error('[Love12B2] Xoá bình luận lỗi:', err)
      );
    }
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) =>
        c.id === confessionId
          ? { ...c, comments: c.comments.filter((cm) => cm.id !== commentId) }
          : c
      ),
    }));
  }, []);

  const adminUpdateSiteContent = useCallback((patch) => {
    setState((s) => ({ ...s, siteContent: { ...s.siteContent, ...patch } }));
  }, []);

  const adminClearAll = useCallback(() => {
    if (isOnlineMode()) {
      clearAllOnline().catch((err) => console.error('[Love12B2] Xoá all lỗi:', err));
    }
    setState((s) => ({ ...s, confessions: [] }));
  }, []);

  const adminRestoreMock = useCallback(() => {
    // Chế độ online: không seed mock lên cloud (tránh rác dữ liệu thật)
    setState((s) => ({ ...s, confessions: MOCK_CONFESSIONS.map(withReactions) }));
  }, []);

  /* Ghim confession luôn lên đầu feed */
  const sortedConfessions = useMemo(() => {
    const pinned = confessions.filter((c) => c.pinned);
    const rest = confessions.filter((c) => !c.pinned);
    return [...pinned, ...rest];
  }, [confessions]);

  const scrollToComposer = () => {
    document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const adminProps = {
    confessions,
    siteContent,
    onUpdateConfession: adminUpdateConfession,
    onDeleteConfession: adminDeleteConfession,
    onTogglePin: adminTogglePin,
    onResetHearts: adminResetHearts,
    onDeleteComment: adminDeleteComment,
    onUpdateSiteContent: adminUpdateSiteContent,
    onRestoreMock: adminRestoreMock,
    onClearAll: adminClearAll,
    onGoHome: goHome,
  };

  /* Deep-link: mở link ngắn #c/xxx (hoặc link cũ #confession-id) → cuộn tới đúng bài.
   * Hook này PHẢI đặt trước mọi `return` sớm (Rules of Hooks). */
  useEffect(() => {
    if (route !== 'home') return;
    const focusTarget = () => {
      const target = parseHashTarget();
      if (!target) return;
      // chờ feed render xong rồi mới cuộn
      setTimeout(() => {
        const el = document.getElementById(`confession-${target.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-fuchsia-300');
          setTimeout(() => el.classList.remove('ring-4', 'ring-fuchsia-300'), 2500);
        }
      }, 400);
    };
    focusTarget();
    window.addEventListener('hashchange', focusTarget);
    return () => window.removeEventListener('hashchange', focusTarget);
  }, [confessions.length, route]);

  /* Trang quản trị riêng biệt — chuyên nghiệp, full-width */
  if (route === 'admin') {
    return <AdminPage {...adminProps} />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Nền gradient động (Tím -> Xanh mộng mơ) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-violet-50 to-sky-100" />
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-floaty rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] animate-floatySlow rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-floaty rounded-full bg-violet-300/30 blur-3xl" />
      </div>

      <Header
        brandName={siteContent.brandName}
        onScrollToComposer={scrollToComposer}
        onGoAdmin={goAdmin}
        onGoHome={goHome}
      />

      {/* Banner trạng thái đồng bộ */}
      {online ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <div className="glass-soft flex items-center justify-center gap-2 px-3 py-2 text-center text-xs font-bold text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            ☁️ Đang online — confession mọi người gửi sẽ tự lưu & hiện realtime cho tất cả
            {syncing && ' · ⏳ đang gửi…'}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <div className="glass-soft flex items-center justify-center gap-2 px-3 py-2 text-center text-xs font-bold text-amber-600">
            💾 {syncError || 'Chế độ demo local — điền Firebase config (src/lib/firebase.js) để bật online.'}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ===== Cột trái: Widget danh ngôn ngẫu nhiên ===== */}
          <div className="space-y-6">
            <RandomConfessionWidget confessions={confessions} />

            <section className="glass-card overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 px-5 py-3 text-white">
                <h2 className="text-base font-bold sm:text-lg">✏️ Viết ẩn danh</h2>
                <p className="text-xs text-white/90">Đừng sợ — 100% ẩn danh, chỉ để vội lòng thoải mái</p>
              </div>
              <ConfessionComposer
                onSubmit={addConfession}
                heroTitle={siteContent.heroTitle}
                heroSubtitle={siteContent.heroSubtitle}
              />
            </section>
          </div>

          {/* ===== Cột phải: Feed masonry ===== */}
          <div className="lg:col-span-8">
            <ConfessionFeed
              confessions={sortedConfessions}
              onToggleHeart={toggleHeart}
              onReact={addReaction}
              onUpdateContent={updateConfessionContent}
              onAddComment={addComment}
            />
          </div>
        </div>
      </main>

      <Footer
        footerPrivacy={siteContent.footerPrivacy}
        footerPromise={siteContent.footerPromise}
        brandName={siteContent.brandName}
      />
    </div>
  );
}
