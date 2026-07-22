import { z } from "zod";
import { DEFAULT_READER_SETTINGS } from "@/lib/constants";
import { getDatabase } from "@/lib/db";
import type { ReaderSettings } from "@/types/reader";
export const readerSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  background: z.enum([
    "paper",
    "white",
    "warm",
    "sepia",
    "sage",
    "mist",
    "charcoal",
    "black",
  ]),
  fontSize: z.number().int().min(15).max(26),
  lineHeight: z.number().min(1.4).max(2),
});
export async function getReaderSettings(
  userId: string,
): Promise<ReaderSettings> {
  const value = await (await getDatabase())
    .collection<ReaderSettings & { userId: string }>("readerSettings")
    .findOne({ userId }, { projection: { _id: 0, userId: 0, updatedAt: 0 } });
  return value ?? DEFAULT_READER_SETTINGS;
}
export async function updateReaderSettings(
  userId: string,
  input: ReaderSettings,
) {
  const settings = readerSettingsSchema.parse(input);
  await (await getDatabase())
    .collection("readerSettings")
    .updateOne(
      { userId },
      { $set: { ...settings, updatedAt: new Date() } },
      { upsert: true },
    );
  return settings;
}
