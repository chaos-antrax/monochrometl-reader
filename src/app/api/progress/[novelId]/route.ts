import { getCurrentUser } from "@/lib/auth";
import { saveProgress } from "@/lib/reader-progress";
export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/progress/[novelId]">,
) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { novelId } = await params;
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.chapterId !== "string" ||
    typeof body.chapterOrder !== "number" ||
    typeof body.scrollProgress !== "number"
  )
    return Response.json({ error: "Invalid progress." }, { status: 400 });
  try {
    await saveProgress({
      userId: user.id,
      novelId,
      chapterId: body.chapterId,
      chapterOrder: body.chapterOrder,
      scrollProgress: body.scrollProgress,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Published chapter not found." },
      { status: 404 },
    );
  }
}
