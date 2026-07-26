import { randomUUID } from 'crypto';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import type { Filter } from 'mongodb';
import type { ContributionMessage, ContributionRequest } from '@/types/contribution';

const messageSchema = z.object({
  body: z.string().trim().min(1, 'Write a message first.').max(2000),
});

async function getOpenRequest(requestId: string, userId: string) {
  return (await getDatabase())
    .collection<ContributionRequest>('readerContributionRequests')
    .findOne({
      id: requestId,
      userId,
      status: 'accepted',
      adminId: { $type: 'string' },
    });
}

export async function GET(
  request: Request,
  { params }: RouteContext<'/api/contributions/[requestId]/messages'>,
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { requestId } = await params;
  if (!(await getOpenRequest(requestId, user.id))) {
    return Response.json({ error: 'Chat is not open yet.' }, { status: 403 });
  }
  const url = new URL(request.url);
  const afterValue = url.searchParams.get('after');
  const afterId = url.searchParams.get('afterId');
  const filter: Filter<ContributionMessage> = { requestId };
  if (afterValue) {
    const after = new Date(afterValue);
    if (Number.isNaN(after.getTime())) {
      return Response.json({ error: 'Invalid message cursor.' }, { status: 400 });
    }
    filter.$or = afterId
      ? [
          { createdAt: { $gt: after } },
          { createdAt: after, id: { $gt: afterId } },
        ]
      : [{ createdAt: { $gt: after } }];
  }
  const items = await (await getDatabase())
    .collection<ContributionMessage>('readerContributionMessages')
    .find(filter, { projection: { _id: 0 } })
    .sort({ createdAt: 1, id: 1 })
    .toArray();
  return Response.json({
    items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
  });
}

export async function POST(
  request: Request,
  { params }: RouteContext<'/api/contributions/[requestId]/messages'>,
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { requestId } = await params;
  if (!(await getOpenRequest(requestId, user.id))) {
    return Response.json({ error: 'Chat is not open yet.' }, { status: 403 });
  }
  const parsed = messageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid message.' },
      { status: 400 },
    );
  }
  const item: ContributionMessage = {
    id: randomUUID(),
    requestId,
    senderId: user.id,
    senderRole: 'reader',
    body: parsed.data.body,
    createdAt: new Date(),
  };
  await (await getDatabase())
    .collection<ContributionMessage>('readerContributionMessages')
    .insertOne(item);
  return Response.json(
    { item: { ...item, createdAt: item.createdAt.toISOString() } },
    { status: 201 },
  );
}
