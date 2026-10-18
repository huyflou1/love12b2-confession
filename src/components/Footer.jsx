import Logo from './Logo.jsx';

/** Footer — điều khoản bảo mật + cam kết 100% ẩn danh */
export default function Footer({ footerPrivacy, footerPromise, brandName }) {
  return (
    <footer className="mt-12 border-t border-white/60 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Thương hiệu */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Logo size={38} withBadge={false} />
              <span className="gradient-text font-bold">{brandName}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Nơi bạn được là chính mình — không sợ judged, không sợ lộ danh tính. 💌
            </p>
          </div>

          {/* Điều khoản bảo mật */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
              🔐 Điều khoản bảo mật
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">{footerPrivacy}</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>· Không cookie theo dõi, không quảng cáo nhắm mục tiêu.</li>
              <li>· Dữ liệu chỉ lưu ở phiên trình duyệt của bạn (demo).</li>
              <li>· Admin không thể truy vết danh tính người gửi.</li>
            </ul>
          </div>

          {/* Cam kết ẩn danh */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
              🕊️ Cam kết ẩn danh 100%
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">{footerPromise}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2">
              <span className="text-lg">🛡️</span>
              <span className="text-xs font-bold text-emerald-600">
                VERIFIED · Ẩn danh tuyệt đối
              </span>
            </div>
          </div>
        </div>

        <div className="divider-heart my-5" />

        <p className="text-center text-xs font-medium text-slate-400">
          © 2026 {brandName} — Made with 💗 cho lớp 12B2. Không ràng buộc, chỉ yêu thương.
        </p>
      </div>
    </footer>
  );
}
