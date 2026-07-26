export type UserRole = 'reader' | 'writer' | 'admin';
export type ReaderUser = { id: string; email: string; role: UserRole; username?: string; createdAt?: string };
export type ReaderSessionPayload = { userId: string; email: string; expiresAt: number };
