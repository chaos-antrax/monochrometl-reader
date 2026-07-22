import { findUserByEmail } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/session';
import { credentialsSchema } from '@/lib/validation';
export async function POST(request:Request){const parsed=credentialsSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return Response.json({error:'Enter a valid email and password.'},{status:400});const user=await findUserByEmail(parsed.data.email);if(!user||!await verifyPassword(parsed.data.password,user.passwordHash))return Response.json({error:'Email or password is incorrect.'},{status:401});await createSession({userId:user._id.toString(),email:user.email});return Response.json({user:{id:user._id.toString(),email:user.email,role:user.role??'reader'}})}
