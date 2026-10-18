import { useCallback, useEffect, useMemo, useState } from 'react';
import ConfessionComposer from './components/ConfessionComposer.jsx';
import ConfessionFeed from './components/ConfessionFeed.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { CUTE_ICONS, DEFAULT_SITE_CONTENT, MOCK_CONFESSIONS, emptyReactions, seedReactions } from './data/mockData.js';
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

  /* Persist demo data */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage đầy hoặc bị chặn — không quan trọng với demo */
    }
  }, [state]);

  /* ============ Hành động trên confession ============ */
  const addConfession = useCallback(({ content, topic, author }) => {
    setState((s) => {
      const next = {
        id: Date.now(),
        author,
        topic,
        icon: CUTE_ICONS[Math.floor(Math.random() * CUTE_ICONS.length)],
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
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) =>
        c.id === id ? { ...c, hearts: Math.max(0, c.hearts + (liked ? 1 : -1)) } : c
      ),
    }));
  }, []);

  const addReaction = useCallback((id, reactionId) => {
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
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, content } : c)),
    }));
  }, []);

  const addComment = useCallback((id, comment) => {
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
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const adminDeleteConfession = useCallback((id) => {
    setState((s) => ({ ...s, confessions: s.confessions.filter((c) => c.id !== id) }));
  }, []);

  const adminTogglePin = useCallback((id) => {
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    }));
  }, []);

  const adminResetHearts = useCallback((id) => {
    setState((s) => ({
      ...s,
      confessions: s.confessions.map((c) => (c.id === id ? { ...c, hearts: 0 } : c)),
    }));
  }, []);

  const adminDeleteComment = useCallback((confessionId, commentId) => {
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

  const adminRestoreMock = useCallback(() => {
    setState((s) => ({ ...s, confessions: MOCK_CONFESSIONS }));
  }, []);

  const adminClearAll = useCallback(() => {
    setState((s) => ({ ...s, confessions: [] }));
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

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ===== Cột trái: Composer + ô đăng nhập admin gọn ===== */}
          <div id="composer" className="space-y-6 lg:col-span-4">
            <ConfessionComposer
              onSubmit={addConfession}
              heroTitle={siteContent.heroTitle}
              heroSubtitle={siteContent.heroSubtitle}
            />
            <section className="glass-card overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 px-5 py-3 text-white">
                <h2 className="text-base font-bold sm:text-lg">🛡️ Bảng điều khiển Admin</h2>
                <p className="text-xs text-white/90">Đăng nhập để mở trang quản trị riêng</p>
              </div>
              <div className="p-5">
                <p className="mb-3 text-xs font-semibold text-slate-500">
                  Chỉnh sửa & xoá toàn bộ nội dung, chuyển đổi linh hoạt 5 tab quản lý trong trang
                  riêng chuyên nghiệp.
                </p>
                <button onClick={goAdmin} className="btn-gradient w-full">
                  🔓 Mở trang quản trị
                </button>
              </div>
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
