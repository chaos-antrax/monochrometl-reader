import { getCurrentUser } from "@/lib/auth";
import { addNovelToLibrary, getReaderLibrary } from "@/lib/reader-library";
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ novels: await getReaderLibrary(user.id) });
}
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const novelId = (await request.json().catch(() => null))?.novelId;
  if (typeof novelId !== "string")
    return Response.json({ error: "Novel ID is required." }, { status: 400 });
  try {
    await addNovelToLibrary(user.id, novelId);
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Published novel not found." },
      { status: 404 },
    );
  }
}
