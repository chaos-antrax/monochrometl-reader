import { randomUUID } from 'crypto';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import type { ContributionRequest } from '@/types/contribution';

const requestSchema = z.object({
  type: z.enum(['translation', 'contribution']),
  novelTitle: z.string().trim().min(2, 'Enter a novel title.').max(160),
  description: z.string().trim().min(10, 'Please add a little more detail.').max(4000),
});
const updateSchema = requestSchema.extend({ id: z.string().uuid() });

function serialize(item: ContributionRequest) {
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    acceptedAt: item.acceptedAt?.toISOString(),
    rejectedAt: item.rejectedAt?.toISOString(),
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await (await getDatabase())
    .collection<ContributionRequest>('readerContributionRequests')
    .find({ userId: user.id }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return Response.json({ items: items.map(serialize) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const collection = (await getDatabase())
    .collection<ContributionRequest>('readerContributionRequests');
  const pendingCount = await collection.countDocuments({
    userId: user.id,
    status: 'pending',
  });
  if (pendingCount >= 3) {
    return Response.json(
      { error: 'You can have up to three pending requests at a time.' },
      { status: 409 },
    );
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 },
    );
  }
  const now = new Date();
  const item: ContributionRequest = {
    id: randomUUID(),
    userId: user.id,
    ...parsed.data,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  await collection.insertOne(item);
  return Response.json({ item: serialize(item) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 },
    );
  }
  const { id, ...changes } = parsed.data;
  const result = await (await getDatabase())
    .collection<ContributionRequest>('readerContributionRequests')
    .updateOne(
      { id, userId: user.id, status: 'pending' },
      { $set: { ...changes, updatedAt: new Date() } },
    );
  if (!result.matchedCount) {
    return Response.json(
      { error: 'Only pending requests can be edited.' },
      { status: 409 },
    );
  }
  return Response.json({ ok: true });
}
