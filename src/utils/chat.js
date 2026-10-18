export const CHAT_RETENTION_MS = 15 * 24 * 60 * 60 * 1000;
export const CHAT_MAX_LENGTH = 500;

export const activeMessages = (messages, now = Date.now()) =>
  messages.filter((message) => Number.isFinite(message.expiresAt) && message.expiresAt > now);