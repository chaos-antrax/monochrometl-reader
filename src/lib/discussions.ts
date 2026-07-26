import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db';

export type PublicDiscussion = { id: string; body: string; rating?: number; username: string; createdAt: string; canEdit: boolean; replies: PublicDiscussion[] };
type DiscussionDoc = { id: string; userId: string; novelId: string; chapterId?: string; parentId?: string; topLevel: boolean; body: string; rating?: number; createdAt: Date; updatedAt: Date };
export type ActivityItem = { id: string; kind: 'review'|'review-reply'|'comment'|'comment-reply'; body: string; rating?: number; createdAt: string; novelTitle: string; chapterTitle?: string; href: string };

export async function getDiscussions(kind: 'review'|'comment', filter: { novelId: string; chapterId?: string }, viewerUserId?: string) {
  const db = await getDatabase(); const name = kind === 'review' ? 'readerReviews' : 'readerComments';
  const docs = await db.collection<DiscussionDoc>(name).find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  const userIds = [...new Set(docs.map((item) => item.userId).filter(ObjectId.isValid))];
  const users = userIds.length ? await db.collection<{ username?: string }>('users').find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } }, { projection: { username: 1 } }).toArray() : [];
  const names = new Map(users.map((user) => [user._id.toString(), user.username || 'Reader']));
  const convert = (doc: DiscussionDoc): PublicDiscussion => ({ id: doc.id, body: doc.body, rating: doc.rating, username: names.get(doc.userId) || 'Reader', createdAt: doc.createdAt.toISOString(), canEdit: doc.userId === viewerUserId, replies: [] });
  const byId = new Map(docs.map((doc) => [doc.id, convert(doc)]));
  const roots = docs.filter((item) => !item.parentId).map((item) => byId.get(item.id)!);
  docs.filter((item) => item.parentId).sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).forEach((doc) => { const parent = byId.get(doc.parentId!); const child = byId.get(doc.id); if (parent && child) parent.replies.push(child); });
  return roots;
}

export async function createDiscussion(input: { kind: 'review'|'comment'; userId: string; novelId: string; chapterId?: string; parentId?: string; body: string; rating?: number }) {
  const db = await getDatabase();
  const novel = await db.collection('novels').findOne({ id: input.novelId, published: true }, { projection: { _id: 1 } }); if (!novel) throw new Error('CONTENT_NOT_FOUND');
  if (input.kind === 'comment') { const chapter = await db.collection('chapters').findOne({ id: input.chapterId, novelId: input.novelId, published: true, publishedVersion: { $type: 'number' } }, { projection: { _id: 1 } }); if (!chapter) throw new Error('CONTENT_NOT_FOUND'); }
  const collection = db.collection<DiscussionDoc>(input.kind === 'review' ? 'readerReviews' : 'readerComments');
  if (input.parentId) { const parent = await collection.findOne({ id: input.parentId, novelId: input.novelId, ...(input.chapterId ? { chapterId: input.chapterId } : {}) }); if (!parent) throw new Error('PARENT_NOT_FOUND'); }
  const now = new Date(); const document: DiscussionDoc = { id: crypto.randomUUID(), userId: input.userId, novelId: input.novelId, ...(input.chapterId ? { chapterId: input.chapterId } : {}), ...(input.parentId ? { parentId: input.parentId } : {}), topLevel: !input.parentId, body: input.body, ...(!input.parentId && input.rating ? { rating: input.rating } : {}), createdAt: now, updatedAt: now };
  await collection.insertOne(document); return document.id;
}

export async function updateDiscussion(input: { kind: 'review'|'comment'; userId: string; novelId: string; chapterId?: string; id: string; body: string; rating?: number }) {
  const db = await getDatabase(); const collection = db.collection<DiscussionDoc>(input.kind === 'review' ? 'readerReviews' : 'readerComments');
  const existing = await collection.findOne({ id: input.id, userId: input.userId, novelId: input.novelId, ...(input.chapterId ? { chapterId: input.chapterId } : {}) });
  if (!existing) throw new Error('NOT_FOUND');
  if (input.kind === 'review' && existing.topLevel && !input.rating) throw new Error('RATING_REQUIRED');
  await collection.updateOne({ _id: existing._id }, { $set: { body: input.body, ...(input.kind === 'review' && existing.topLevel ? { rating: input.rating } : {}), updatedAt: new Date() } });
}

export async function getUserActivity(userId: string): Promise<ActivityItem[]> {
  const db=await getDatabase();const[reviews,comments]=await Promise.all([db.collection<DiscussionDoc>('readerReviews').find({userId}).toArray(),db.collection<DiscussionDoc>('readerComments').find({userId}).toArray()]);const all=[...reviews,...comments];if(!all.length)return[];
  const novelIds=[...new Set(all.map((item)=>item.novelId))];const chapterIds=[...new Set(comments.map((item)=>item.chapterId).filter((value):value is string=>Boolean(value)))];const[novels,chapters]=await Promise.all([db.collection<{id:string;title:string}>('novels').find({id:{$in:novelIds}},{projection:{_id:0,id:1,title:1}}).toArray(),chapterIds.length?db.collection<{id:string;title:string}>('chapters').find({id:{$in:chapterIds}},{projection:{_id:0,id:1,title:1}}).toArray():[]]);const novelNames=new Map(novels.map((item)=>[item.id,item.title]));const chapterNames=new Map(chapters.map((item)=>[item.id,item.title]));
  return all.map((item):ActivityItem=>{const review=!item.chapterId;const kind:ActivityItem['kind']=review?(item.parentId?'review-reply':'review'):(item.parentId?'comment-reply':'comment');return{id:item.id,kind,body:item.body,rating:item.rating,createdAt:item.createdAt.toISOString(),novelTitle:novelNames.get(item.novelId)||'Unavailable novel',chapterTitle:item.chapterId?chapterNames.get(item.chapterId):undefined,href:item.chapterId?`/novels/${item.novelId}/read/${item.chapterId}`:`/novels/${item.novelId}`}}).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
}
