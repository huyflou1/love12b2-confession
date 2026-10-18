import { AdminDashboard, AdminLoginGate } from '../components/AdminPanel.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import Logo from '../components/Logo.jsx';

/**
 * Trang Admin riêng biệt (#/admin) — chuyên nghiệp, full-width.
 * - Chưa đăng nhập: form login căn giữa trang (pass masked, không hiện lên panel).
 * - Đã đăng nhập: AdminDashboard với sidebar tab trực quan.
 */
export default function AdminPage(props) {
  const { onGoHome, siteContent } = props;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-violet-50 to-sky-100" />
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-floaty rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] animate-floatySlow rounded-full bg-sky-300/30 blur-3xl" />
      </div>

      <Header
        brandName={siteContent.brandName}
        isAdminPage
        onGoHome={onGoHome}
        onScrollToComposer={onGoHome}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <button
          onClick={onGoHome}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-violet-600"
        >
          ← Trang chủ
          <span className="text-slate-300">/</span>
          <span className="text-violet-600">Quản trị</span>
        </button>

        <AdminLoginGate>
          {({ onLogout }) => (
            <AdminDashboard {...props} onLogout={onLogout} onGoHome={onGoHome} />
          )}
        </AdminLoginGate>

        {/* Chân trang admin */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <Logo size={24} withBadge={false} />
          Khu vực quản trị · {siteContent.brandName} · Bảo mật tuyệt đối 🔐
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
