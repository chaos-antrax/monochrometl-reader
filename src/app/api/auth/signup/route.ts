import { MongoServerError } from 'mongodb';
import { getDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { createSession } from '@/lib/session';
import { signupSchema } from '@/lib/validation';
import type { UserDocument } from '@/lib/auth';
export async function POST(request:Request){const parsed=signupSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message??'Invalid details.'},{status:400});const{email,password}=parsed.data;const users=(await getDatabase()).collection<UserDocument>('users');if(await users.findOne({email},{projection:{_id:1}}))return Response.json({error:'An account with this email already exists.'},{status:409});const now=new Date();try{const result=await users.insertOne({email,passwordHash:await hashPassword(password),role:'reader',createdAt:now,updatedAt:now});await createSession({userId:result.insertedId.toString(),email});return Response.json({user:{id:result.insertedId.toString(),email,role:'reader'}},{status:201})}catch(error){if(error instanceof MongoServerError&&error.code===11000)return Response.json({error:'An account with this email already exists.'},{status:409});throw error}}
