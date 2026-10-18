import {
  addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { isOnlineMode } from './confessionStore.js';
import { CHAT_MAX_LENGTH, CHAT_RETENTION_MS } from '../utils/chat.js';
import { moderateText } from '../utils/moderation.js';

export const subscribeChat = (onData, onError) => {
  if (!isOnlineMode()) return () => {};
  return onSnapshot(
    query(collection(db, 'chatMessages'), orderBy('createdAt', 'desc'), limit(100)),
    { includeMetadataChanges: true },
    (snapshot) => onData(snapshot.docs.map((document) => {
      const data = document.data({ serverTimestamps: 'estimate' });
      return {
        id: document.id,
        author: typeof data.author === 'string' ? data.author : 'Ẩn danh',
        content: typeof data.content === 'string' ? data.content : '',
        createdAt: data.createdAt?.toMillis?.() ?? null,
        expiresAt: data.expiresAt?.toMillis?.() ?? 0,
      };
    }).reverse(), !snapshot.metadata.fromCache),
    onError
  );
};

export const sendChatMessage = async ({ author, content }) => {
  if (!isOnlineMode()) throw new Error('Chat cần kết nối Firebase.');
  const text = content.trim();
  if (!text || text.length > CHAT_MAX_LENGTH) throw new Error('Tin nhắn cần từ 1 đến 500 ký tự.');
  const name = author.trim().slice(0, 30) || 'Ẩn danh';
  const moderation = moderateText(`${name} ${text}`);
  if (moderation.level !== 'ok') throw new Error(moderation.issues[0].message);
  await addDoc(collection(db, 'chatMessages'), {
    author: name,
    content: text,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + CHAT_RETENTION_MS),
  });
};