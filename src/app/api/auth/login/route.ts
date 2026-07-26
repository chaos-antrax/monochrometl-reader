import { findUserByEmail } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/session';
import { credentialsSchema } from '@/lib/validation';
import { checkAuthRateLimit, rateLimitedResponse } from '@/lib/rate-limit';
export async function POST(request:Request){const body=await request.json().catch(()=>null);const parsed=credentialsSchema.safeParse(body);const limit=await checkAuthRateLimit(request,'login',parsed.success?parsed.data.email:undefined);if(!limit.allowed)return rateLimitedResponse(limit.retryAfter);if(!parsed.success)return Response.json({error:'Enter a valid email and password.'},{status:400});const user=await findUserByEmail(parsed.data.email);if(!user||!await verifyPassword(parsed.data.password,user.passwordHash))return Response.json({error:'Email or password is incorrect.'},{status:401});await createSession({userId:user._id.toString(),email:user.email});return Response.json({user:{id:user._id.toString(),email:user.email,role:user.role??'reader'}})}
