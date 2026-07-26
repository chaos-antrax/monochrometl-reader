import { MongoServerError, ObjectId } from 'mongodb';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
const schema = z.object({ username: z.string().trim().min(3).max(24).regex(/^[A-Za-z0-9_]+$/, 'Use only letters, numbers, and underscores.') });
export async function PUT(request: Request) { const user = await getCurrentUser(); if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 }); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid username.' }, { status: 400 }); const username = parsed.data.username; try { await (await getDatabase()).collection('users').updateOne({ _id: new ObjectId(user.id) }, { $set: { username, usernameNormalized: username.toLowerCase(), updatedAt: new Date() } }); return Response.json({ username }); } catch (error) { if (error instanceof MongoServerError && error.code === 11000) return Response.json({ error: 'That username is already taken.' }, { status: 409 }); throw error; } }
