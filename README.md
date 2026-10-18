# 💗 Love12B2 Confession — Anonymous Confession Landing Page

Web Landing Page cho ứng dụng **"Anonymous Confession"** — phong cách trong trẻo, tươi sáng,
kute, hiện đại. Màu chủ đạo Hồng / Xanh da trời, hiệu ứng **Glassmorphism**, điểm nhấn
**gradient Tím → Xanh mộng mơ**.

## Công nghệ

- **React 18** (Functional Components + Hooks)
- **Tailwind CSS 3**
- **Vite 5**

## Chạy thử

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # build production → thư mục dist/
```

## Cấu trúc Component

```
src/
├── main.jsx
├── index.css                 # utility: .glass, .btn-gradient, .masonry…
├── App.jsx                   # state toàn cục + layout 2 cột + nền gradient động
├── data/mockData.js          # TOPICS, CUTE_ICONS, 8 confession mẫu, nội dung trang
├── utils/share.js            # link chia sẻ, copy, Facebook, TikTok, timeAgo
└── components/
    ├── Logo.jsx              # logo corgi vẽ lại bằng SVG (tái hiện ảnh đính kèm)
    ├── Header.jsx            # logo + tiêu đề + 🟢 online + nút Quản trị/Về trang chủ
    ├── OnlineCounter.jsx     # đếm online realtime (mô phỏng, cập nhật 5s/lần)
    ├── ConfessionComposer.jsx# tiêu đề cảm xúc + nhập tin + kiểm duyệt văn minh realtime
    ├── ConfessionFeed.jsx    # Top-5 nhiều tim, lưới Masonry + bộ lọc chủ đề
    ├── ConfessionCard.jsx    # ngày giờ cụ thể, reactions, bình luận gọn, chia sẻ, sửa
    ├── ReactionBar.jsx       # ❤️😭🥺🤫🍵🧀 + hiệu ứng emoji bay
    ├── ShareModal.jsx        # modal chia sẻ chuẩn + short link mã hoá
    ├── AdminPanel.jsx        # AdminLoginGate + AdminDashboard (5 tab, pass không hiện UI)
    └── Footer.jsx            # điều khoản bảo mật + cam kết ẩn danh 100%
└── pages/
    └── AdminPage.jsx         # TRANG QUẢN TRỊ RIÊNG (#/admin) — full-width chuyên nghiệp
```

## Tài khoản Admin

- **🛡️ Trang quản trị riêng biệt** (`#/admin`): đăng nhập pass `huyphuong0508` (masked 👁️/🙈, không hiện lên panel) → nhảy sang trang full-width chuyên nghiệp với sidebar chuyển đổi linh hoạt 5 tab: Tổng quan · Quản lý confession (sửa/xoá/ghim/reset ❤️/tìm kiếm) · Bình luận · Nội dung trang · Cài đặt + Xoá toàn bộ

## Tính năng

- **💬 Bình luận gọn, không cắt tràn**: mặc định hiện 3 câu mới nhất, nút "Xem thêm", danh sách cuộn nội bộ `max-h`, chữ `break-words`, form grid co giãn mobile
- Thả tim + **reactions kute**: ❤️ 😭 Đồng cảm · 🥺 Thương thương · 🤫 Giữ bí mật · 🍵 Hóng hớt · 🧀 Thả thính (hiệu ứng emoji bay), icon kute đầu mỗi bài, `#id`, huy hiệu 🔥 Top, chỉnh sửa confession
- Ẩn danh 100% hoặc tự điền tên (bút danh)
- **🟢 Đếm số người online ngay trên Header** (cập nhật trực tiếp mỗi 5s)
- **📅 Ngày giờ cụ thể mỗi bài viết**: badge `14:30 · 15/10/2026` dưới tên tác giả + trong mọi bình luận + trong panel admin (kèm "x giờ trước")
- **Short link mã hoá ID** cho mỗi bài (`#c/aB3x`) — mở link cuộn thẳng tới đúng bài
- **Popup chia sẻ dạng modal chuẩn** (overlay + nút ✕ + phím ESC): Copy link, Facebook, TikTok, Messenger, Hệ thống/Story
- **Bộ Lọc Từ Khóa Văn Minh**: chặn SĐT/email/địa chỉ 🚫, cảnh báo từ toxic ⚠️
- Responsive: 1 cột (mobile) → sidebar + Masonry 3 cột (desktop)
- Demo lưu dữ liệu vào `localStorage` trình duyệt (không gửi lên server — đúng cam kết ẩn danh)
## Phân trang và chat realtime

- Mọi bộ lọc hiển thị tối đa 20 confession/trang, có nút trước/sau và số trang.
- Chuyển trang có hiệu ứng nhẹ, cuộn mượt; hỗ trợ reduced motion và link bài viết.
- Phân trang hiện thực hiện phía client trên toàn bộ confession tải qua realtime (không còn giới hạn 200 bài). Với dữ liệu lớn cần chuyển sang Firestore cursor pagination để giảm lượt đọc.
- Chatbox nằm dưới widget châm ngôn, đồng bộ 100 tin gần nhất từ collection `chatMessages`. Tin lỗi giữ nguyên bản nháp; không giả lập gửi thành công khi offline.
- Mỗi tin có `createdAt` (server timestamp) và `expiresAt` (Timestamp sau 15 ngày). UI tự ẩn tin hết hạn; không dùng trình duyệt để xóa dữ liệu máy chủ.

### Bắt buộc cấu hình Firebase trước khi dùng chat production

1. Hợp nhất `docs/chat-rules.fragment.txt` vào Firestore rules hiện tại rồi Publish. Không thay toàn bộ rules bằng fragment. Đây là chat khách công khai, chưa có xác thực danh tính/chống spam; cần Auth/App Check và giới hạn gửi phía server cho production. Kiểm tra không có wildcard rule rộng vô hiệu hóa giới hạn.
2. Trong Google Cloud Console, chọn project `love12b2-confession` → Firestore database → Time-to-live → Create policy: collection group **chatMessages**, timestamp field **expiresAt**. Chờ policy Active.
   Hoặc chạy bằng tài khoản có quyền:
   ```sh
   gcloud firestore fields ttls update expiresAt --collection-group=chatMessages --enable-ttl --project=love12b2-confession
   ```
3. TTL xóa bất đồng bộ, thường trong vòng 24 giờ sau hết hạn, không đảm bảo xóa đúng giây thứ 15 ngày. TTL delete có tính phí; kiểm tra billing/quyền của project. Tài liệu: https://firebase.google.com/docs/firestore/ttl
4. Cấu hình rules/TTL trên cloud **không tự được triển khai bởi Vite build**. Chưa bật TTL thì dữ liệu chỉ bị ẩn, chưa tự xóa trên server. Đồng hồ máy gửi sai quá 5 phút có thể bị mẫu rules từ chối.

Kiểm tra: mở hai trình duyệt, gửi tin ở một cửa sổ và kiểm tra cửa sổ kia; thử mất mạng/quyền bị từ chối để kiểm tra bản nháp. Với >=21 confession, thử chuyển trang, đổi bộ lọc và mở link bài ở trang sau.
