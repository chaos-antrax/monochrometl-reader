import type { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { ReaderUser, UserRole } from "@/types/user";
type UserDocument = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
export async function findUserByEmail(email: string) {
  return (await getDatabase())
    .collection<UserDocument>("users")
    .findOne({ email });
}
export async function getCurrentUser(): Promise<ReaderUser | null> {
  const session = await getSession();
  if (!session) return null;
  return { id: session.userId, email: session.email, role: "reader" };
}
