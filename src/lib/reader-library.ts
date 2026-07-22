import { getDatabase } from "@/lib/db";
import { getPublishedNovelSummaries } from "@/lib/published-content";
export async function getReaderLibrary(userId: string) {
  const entries = await (await getDatabase())
    .collection<{ userId: string; novelId: string }>("readerLibrary")
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();
  const order = new Map(entries.map((item, index) => [item.novelId, index]));
  return (await getPublishedNovelSummaries())
    .filter((novel) => order.has(novel.id))
    .sort((a, b) => order.get(a.id)! - order.get(b.id)!);
}
export async function addNovelToLibrary(userId: string, novelId: string) {
  const db = await getDatabase();
  if (
    !(await db
      .collection("novels")
      .findOne({ id: novelId, published: true }, { projection: { _id: 1 } }))
  )
    throw new Error("Novel not found.");
  const now = new Date();
  await db
    .collection("readerLibrary")
    .updateOne(
      { userId, novelId },
      { $set: { updatedAt: now }, $setOnInsert: { addedAt: now } },
      { upsert: true },
    );
}
export async function removeNovelFromLibrary(userId: string, novelId: string) {
  await (await getDatabase())
    .collection("readerLibrary")
    .deleteOne({ userId, novelId });
}
export async function isNovelInLibrary(userId: string, novelId: string) {
  return Boolean(
    await (await getDatabase())
      .collection("readerLibrary")
      .findOne({ userId, novelId }, { projection: { _id: 1 } }),
  );
}
