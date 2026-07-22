import { getCurrentUser } from "@/lib/auth";
import { getReaderSettings, updateReaderSettings } from "@/lib/reader-settings";
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ settings: await getReaderSettings(user.id) });
}
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return Response.json({
      settings: await updateReaderSettings(user.id, await request.json()),
    });
  } catch {
    return Response.json(
      { error: "Invalid reader settings." },
      { status: 400 },
    );
  }
}
