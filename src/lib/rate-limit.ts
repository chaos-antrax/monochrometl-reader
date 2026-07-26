import { getDatabase } from '@/lib/db';

const WINDOW_MS = 15 * 60 * 1000;
const IP_LIMIT = 20;
const ACCOUNT_LIMIT = 7;

type RateLimitDoc = { _id: string; count: number; expiresAt: Date };

function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function checkAuthRateLimit(request: Request, action: 'login' | 'signup', email?: string) {
  const now = Date.now();
  const bucket = Math.floor(now / WINDOW_MS);
  const expiresAt = new Date((bucket + 2) * WINDOW_MS);
  const scopes = [
    { key: `${action}:ip:${clientAddress(request)}:${bucket}`, limit: IP_LIMIT },
    { key: `${action}:account:${email || 'invalid'}:${bucket}`, limit: ACCOUNT_LIMIT },
  ];
  const collection = (await getDatabase()).collection<RateLimitDoc>('authRateLimits');
  for (const scope of scopes) {
    const entry = await collection.findOneAndUpdate(
      { _id: scope.key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: 'after' },
    );
    if (entry && entry.count > scope.limit) {
      return { allowed: false as const, retryAfter: Math.max(1, Math.ceil(((bucket + 1) * WINDOW_MS - now) / 1000)) };
    }
  }
  return { allowed: true as const };
}

export function rateLimitedResponse(retryAfter: number) {
  return Response.json(
    { error: 'Too many attempts. Please wait before trying again.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}
