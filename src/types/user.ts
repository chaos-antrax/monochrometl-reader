export type UserRole = "reader" | "writer" | "admin";
export type ReaderUser = { id: string; email: string; role: UserRole };
export type ReaderSessionPayload = {
  userId: string;
  email: string;
  expiresAt: number;
};
