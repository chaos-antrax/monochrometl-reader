import { getDatabase } from "@/lib/db";
import type { ReaderProgress } from "@/types/reader";
export async function getProgress(userId: string, novelId: string) {
  return (await getDatabase())
    .collection<ReaderProgress>("readerProgress")
    .findOne({ userId, novelId });
}
export async function saveProgress(input: Omit<ReaderProgress, "updatedAt">) {
  const db = await getDatabase();
  const novel = await db.collection('novels').findOne(
    { id: input.novelId, published: true },
    { projection: { _id: 1 } },
  );
  if (!novel) throw new Error('Novel not found.');
  const chapter = await db
    .collection("chapters")
    .findOne(
      {
        id: input.chapterId,
        novelId: input.novelId,
        published: true,
        publishedVersion: { $type: "number" },
      },
      { projection: { _id: 1 } },
    );
  if (!chapter) throw new Error("Chapter not found.");
  const scrollProgress = Math.max(0, Math.min(1, input.scrollProgress));
  await db
    .collection("readerProgress")
    .updateOne(
      { userId: input.userId, novelId: input.novelId },
      { $set: { ...input, scrollProgress, updatedAt: new Date() } },
      { upsert: true },
    );
}
