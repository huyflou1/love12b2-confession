import test from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../src/utils/pagination.js';
import { activeMessages, CHAT_RETENTION_MS } from '../src/utils/chat.js';
import { buildShortUrl, parseHashTarget } from '../src/utils/shortlink.js';

test('pagination uses 20 items, including a partial last page', () => {
  const items = Array.from({ length: 45 }, (_, index) => index);
  assert.equal(paginate(items, 1).items.length, 20);
  assert.deepEqual(paginate(items, 2).items, items.slice(20, 40));
  assert.deepEqual(paginate(items, 3).items, items.slice(40));
  assert.equal(paginate(items, 3).totalPages, 3);
});

test('pagination clamps empty, deleted and out-of-range pages', () => {
  assert.deepEqual(paginate([], 9), { page: 1, totalPages: 1, offset: 0, items: [] });
  assert.equal(paginate([1, 2], 9).page, 1);
  assert.equal(paginate([1, 2], -1).page, 1);
  assert.equal(paginate(Array(20).fill(1), 2).totalPages, 1);
});

test('chat expires at the 15-day boundary and rejects malformed expiry', () => {
  assert.equal(CHAT_RETENTION_MS, 1296000000);
  const now = 1000;
  const messages = [
    { id: 'expired', expiresAt: 999 }, { id: 'boundary', expiresAt: 1000 },
    { id: 'active', expiresAt: 1001 }, { id: 'invalid' },
    { id: 'bad', expiresAt: NaN },
  ];
  assert.deepEqual(activeMessages(messages, now).map((message) => message.id), ['active']);
});

test('sharing round-trips numeric and Firestore IDs and rejects malformed hash', () => {
  const originalWindow = globalThis.window;
  globalThis.window = { location: { origin: 'https://example.test', pathname: '/', hash: '' } };
  try {
    for (const id of [101, 'AbCdEf1234567890cloud', '123456']) {
      const url = buildShortUrl(id);
      window.location.hash = new URL(url).hash;
      assert.equal(String(parseHashTarget().id), String(id));
    }
    window.location.hash = '#confession-%invalid';
    assert.equal(parseHashTarget(), null);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});