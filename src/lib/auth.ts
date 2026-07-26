import { ObjectId, type WithId } from 'mongodb';
import { getDatabase } from '@/lib/db';
import { getSession } from '@/lib/session';
import type { ReaderUser, UserRole } from '@/types/user';
export type UserDocument = { email: string; passwordHash: string; role?: UserRole; username?: string; usernameNormalized?: string; createdAt: Date; updatedAt: Date };
export async function findUserByEmail(email: string): Promise<WithId<UserDocument> | null> { return (await getDatabase()).collection<UserDocument>('users').findOne({ email: email.trim().toLowerCase() }); }
export async function getCurrentUser(): Promise<ReaderUser | null> { const session=await getSession(); if(!session||!ObjectId.isValid(session.userId))return null; const user=await(await getDatabase()).collection<UserDocument>('users').findOne({_id:new ObjectId(session.userId)},{projection:{email:1,role:1,username:1,createdAt:1}}); if(!user)return null; return{id:user._id.toString(),email:user.email,role:user.role??'reader',username:user.username,createdAt:user.createdAt?.toISOString()}; }
