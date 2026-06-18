// Lightweight in-memory rate limiter. Sliding window per key.
//
// Notes:
// - Memory is per Vercel serverless instance, so this is best-effort. For
//   stricter limits use Upstash Redis or Vercel KV. This is good enough to
//   stop accidental hammering or trivial abuse from a public mobile build.
// - Keys are typically the requester IP.

const MAX_BUCKETS = 5000;
const buckets = new Map();

function trimMap() {
  if (buckets.size <= MAX_BUCKETS) return;
  const removeCount = buckets.size - MAX_BUCKETS;
  const it = buckets.keys();
  for (let i = 0; i < removeCount; i += 1) {
    const next = it.next();
    if (next.done) break;
    buckets.delete(next.value);
  }
}

/**
 * @param {string} key
 * @param {{ windowMs?: number, max?: number }} [options]
 * @returns {{ allowed: boolean, retryAfterSec: number, remaining: number }}
 */
export function checkRateLimit(key, options = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 10;
  const now = Date.now();

  const arr = buckets.get(key) ?? [];
  const recent = arr.filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    const oldest = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, recent);
    return { allowed: false, retryAfterSec, remaining: 0 };
  }

  recent.push(now);
  buckets.set(key, recent);
  trimMap();
  return { allowed: true, retryAfterSec: 0, remaining: max - recent.length };
}

/** @param {import('next').NextApiRequest} req */
export function getClientKey(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  if (Array.isArray(xff) && xff.length > 0) {
    return xff[0];
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp;
  return req.socket?.remoteAddress || 'anonymous';
}
