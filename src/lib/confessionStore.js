import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

export const isOnlineMode = () => isFirebaseConfigured && !!db;

const CONFESSIONS = 'confessions';

const toConfession = (snap) => {
  const d = snap.data();
  return {
    id: snap.id,
    author: d.author ?? null,
    topic: d.topic || 'love',
    icon: d.icon || '💌',
    content: d.content || '',
    hearts: d.hearts || 0,
    reactions: d.reactions || { cry: 0, please: 0, secret: 0, tea: 0, cheese: 0 },
    pinned: !!d.pinned,
    createdAt:
      d.createdAt?.toDate?.()?.toISOString?.() ||
      (typeof d.createdAt === 'string' ? d.createdAt : new Date().toISOString()),
    comments: (d.comments || []).map((c, i) => ({
      id: c.id ?? `${snap.id}-c${i}`,
      author: c.author ?? null,
      content: c.content || '',
      createdAt:
        c.createdAt?.toDate?.()?.toISOString?.() ||
        (typeof c.createdAt === 'string' ? c.createdAt : new Date().toISOString()),
    })),
  };
};

/** Lắng nghe realtime toàn bộ confession (mọi người gửi là mọi máy thấy ngay) */
export const subscribeConfessions = (onData, onError) => {
  if (!isOnlineMode()) return () => {};
  const q = query(collection(db, CONFESSIONS), orderBy('createdAt', 'desc'), limit(200));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toConfession)),
    (err) => onError?.(err)
  );
};

/** Người dùng gửi confession online → tự lưu lên Firestore */
export const createConfessionOnline = async ({ content, topic, author, icon }) => {
  const ref = await addDoc(collection(db, CONFESSIONS), {
    content,
    topic,
    author: author ?? null,
    icon,
    hearts: 0,
    reactions: { cry: 0, please: 0, secret: 0, tea: 0, cheese: 0 },
    pinned: false,
    createdAt: serverTimestamp(),
    comments: [],
  });
  return ref.id;
};

/** +1 / -1 tim */
export const bumpHeartsOnline = async (id, delta) => {
  const { getDoc, updateDoc } = await import('firebase/firestore');
  const ref = doc(db, CONFESSIONS, String(id));
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  await updateDoc(ref, { hearts: Math.max(0, (snap.data().hearts || 0) + delta) });
};

/** +1 một emoji reaction */
export const bumpReactionOnline = async (id, reactionId) => {
  const { getDoc, updateDoc, increment } = await import('firebase/firestore');
  const ref = doc(db, CONFESSIONS, String(id));
  await updateDoc(ref, { [`reactions.${reactionId}`]: increment(1) });
};

/** Sửa nội dung / chủ đề (người dùng + admin) */
export const updateConfessionOnline = async (id, patch) => {
  await updateDoc(doc(db, CONFESSIONS, String(id)), patch);
};

/** Xoá confession (admin) */
export const deleteConfessionOnline = async (id) => {
  await deleteDoc(doc(db, CONFESSIONS, String(id)));
};

/** Ghim / bỏ ghim */
export const togglePinOnline = async (id, pinned) => {
  await updateDoc(doc(db, CONFESSIONS, String(id)), { pinned });
};

/** Thêm bình luận — lưu trong mảng comments của document */
export const addCommentOnline = async (id, { content, author }) => {
  await updateDoc(doc(db, CONFESSIONS, String(id)), {
    comments: arrayUnion({
      id: `${Date.now()}`,
      content,
      author: author ?? null,
      createdAt: new Date().toISOString(),
    }),
  });
};

/** Xoá bình luận (admin): đọc → lọc → ghi lại */
export const deleteCommentOnline = async (confessionId, commentId) => {
  const { getDoc } = await import('firebase/firestore');
  const ref = doc(db, CONFESSIONS, String(confessionId));
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const kept = (snap.data().comments || []).filter((c) => String(c.id) !== String(commentId));
  await updateDoc(ref, { comments: kept });
};

/** Xoá toàn bộ (vùng nguy hiểm) */
export const clearAllOnline = async () => {
  const snap = await getDocs(collection(db, CONFESSIONS));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
};

export { arrayRemove };
