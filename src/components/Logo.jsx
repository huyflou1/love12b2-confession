/**
 * Logo corgi kute — vẽ lại bằng SVG thuần (tái hiện từ ảnh đính kèm),
 * không vỡ pixel khi phóng to và không dính watermark.
 */
export default function Logo({ size = 44, withBadge = true }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        role="img"
        aria-label="Love12B2 corgi logo"
      >
        <defs>
          <linearGradient id="corgiEar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC98A" />
            <stop offset="100%" stopColor="#F5A65B" />
          </linearGradient>
          <linearGradient id="corgiHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFCF98" />
            <stop offset="100%" stopColor="#F0994A" />
          </linearGradient>
          <linearGradient id="corgiBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        {/* Tai */}
        <path
          d="M34 46 C26 34 24 18 28 12 C33 6 46 16 54 30 L48 48 Z"
          fill="url(#corgiEar)"
          stroke="#111827"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M86 46 C94 34 96 18 92 12 C87 6 74 16 66 30 L72 48 Z"
          fill="url(#corgiEar)"
          stroke="#111827"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M35 38 C31 29 30 20 33 17 C37 14 44 22 48 30 Z" fill="#FFFFFF" opacity="0.85" />
        <path d="M85 38 C89 29 90 20 87 17 C83 14 76 22 72 30 Z" fill="#FFFFFF" opacity="0.85" />

        {/* Đầu */}
        <path
          d="M60 26 C84 26 96 42 96 62 C96 82 84 96 60 96 C36 96 24 82 26 62 C28 42 36 26 60 26 Z"
          fill="url(#corgiHead)"
          stroke="#111827"
          strokeWidth="3.5"
        />

        {/* Vệt lông trắng giữa mặt */}
        <path
          d="M60 26 C53 26 49 38 48 52 C47 66 50 82 60 84 C70 82 73 66 72 52 C71 38 67 26 60 26 Z"
          fill="#FFFFFF"
        />

        {/* Mắt */}
        <circle cx="43" cy="58" r="7.5" fill="#111827" />
        <circle cx="77" cy="58" r="7.5" fill="#111827" />
        <circle cx="45.5" cy="55" r="2.6" fill="#FFFFFF" />
        <circle cx="79.5" cy="55" r="2.6" fill="#FFFFFF" />

        {/* Mũi + miệng */}
        <ellipse cx="60" cy="70" rx="6.5" ry="5" fill="#111827" />
        <path
          d="M60 75 C60 80 54 82 50 78 M60 75 C60 80 66 82 70 78"
          stroke="#111827"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lưỡi */}
        <path
          d="M55 79 C55 88 65 88 65 79 Z"
          fill="#F43F5E"
          stroke="#111827"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Râu má hồng */}
        <circle cx="34" cy="70" r="5" fill="#FDA4AF" opacity="0.6" />
        <circle cx="86" cy="70" r="5" fill="#FDA4AF" opacity="0.6" />

        {/* Tay cầm thanh ngang */}
        <ellipse cx="30" cy="99" rx="11" ry="8" fill="#FFFFFF" stroke="#111827" strokeWidth="3.5" />
        <ellipse cx="90" cy="99" rx="11" ry="8" fill="#FFFFFF" stroke="#111827" strokeWidth="3.5" />

        {/* Thanh ngang (tay vịn) */}
        <rect x="6" y="100" width="108" height="9" rx="4.5" fill="url(#corgiBar)" />
      </svg>

      {withBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-sky-400 text-[10px] shadow-candy ring-2 ring-white">
          💖
        </span>
      )}
    </div>
  );
}
