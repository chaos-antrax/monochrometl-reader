import { getCurrentUser } from "@/lib/auth";
import { removeNovelFromLibrary } from "@/lib/reader-library";
export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/library/[novelId]">,
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { novelId } = await params;
  await removeNovelFromLibrary(user.id, novelId);
  return Response.json({ ok: true });
}
