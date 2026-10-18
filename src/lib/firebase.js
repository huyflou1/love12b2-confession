import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Cấu hình Firebase — project "Love12B2-Confession".
 *
 * ⚠️ BẠN CẦN ĐIỀN THÔNG TIN THẬT: lấy tại
 * Firebase Console → Project settings → Your apps → Web app → firebaseConfig
 * rồi thay vào object bên dưới (KHÔNG commit key riêng tư lên repo public nếu có).
 *
 * Có thể dùng biến môi trường Vite thay vì hard-code:
 * tạo file `.env` với VITE_FIREBASE_API_KEY=... rồi đọc qua import.meta.env
 */
const firebaseConfig = {
  apiKey: "AIzaSyBn20GR1kky1gK2TSRz7hm8Qdak1B-iIEk",
  authDomain: "love12b2-confession.firebaseapp.com",
  projectId: "love12b2-confession",
  storageBucket: "love12b2-confession.firebasestorage.app",
  messagingSenderId: "141162200891",
  appId: "1:141162200891:web:29e1e6493d29a47b81811e",
  measurementId: "G-Z7QY5NHG3C",
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'YOUR_API_KEY' && !!firebaseConfig.projectId;

let db = null;
if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else if (typeof console !== 'undefined') {
  console.warn(
    '[Love12B2] Chưa cấu hình Firebase (src/lib/firebase.js) — app chạy ở chế độ localStorage demo.'
  );
}

export { db };
