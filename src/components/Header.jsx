import Logo from './Logo.jsx';
import OnlineCounter from './OnlineCounter.jsx';

/** Header — logo + tên thương hiệu + online + nút hành động (ẩn nút Quản trị khi ở trang admin) */
export default function Header({
  brandName,
  onScrollToComposer,
  unreadCount = 0,
  isAdminPage = false,
  onGoAdmin,
  onGoHome,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo + tên */}
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div className="leading-tight">
            <h1
              className="gradient-text cursor-pointer text-lg font-bold sm:text-2xl"
              onClick={onGoHome}
              title="Về trang chủ"
            >
              {brandName}
            </h1>
            <p className="hidden text-xs font-semibold text-slate-500 sm:block">
              💌 Nơi thầm thì điều trái tim muốn nói
            </p>
          </div>
        </div>

        {/* Hành động */}
        <div className="flex items-center gap-2">
          <OnlineCounter />
          <span className="glass-soft hidden items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 lg:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Máy chủ ẩn danh — đang ổn định
          </span>
          {isAdminPage ? (
            <button onClick={onGoHome} className="btn-ghost !px-4 !py-2 text-sm">
              🏠 Về trang chủ
            </button>
          ) : (
            <>
              <button onClick={onGoAdmin} className="btn-ghost !hidden !px-4 !py-2 text-sm sm:!inline-flex">
                🛡️ Quản trị
              </button>
              <button onClick={onScrollToComposer} className="btn-gradient !px-4 !py-2 text-sm">
                ✏️ Viết ngay
                {unreadCount > 0 && (
                  <span className="ml-1 rounded-full bg-white/25 px-2 text-xs">{unreadCount}</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
