import { getCurrentUser } from "@/lib/auth";
export async function GET() {
  const user = await getCurrentUser();
  return user
    ? Response.json({ user })
    : Response.json({ error: "Unauthorized" }, { status: 401 });
}
