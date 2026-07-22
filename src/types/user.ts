export type UserRole = 'reader' | 'writer' | 'admin';
export type ReaderUser = { id: string; email: string; role: UserRole; createdAt?: string };
export type ReaderSessionPayload = { userId: string; email: string; expiresAt: number };
