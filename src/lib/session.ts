import { cookies } from 'next/headers';
import type { ReaderSessionPayload } from '@/types/user';
const COOKIE_NAME='mr_session';
const MAX_AGE=60*60*24*30;
const encoder=new TextEncoder();
function secret(){const value=process.env.READER_SESSION_SECRET;if(!value)throw new Error('READER_SESSION_SECRET is not configured.');return value}
function encode(value:string){return Buffer.from(value).toString('base64url')}
function decode(value:string){return Buffer.from(value,'base64url').toString('utf8')}
async function getKey(usage:KeyUsage){return crypto.subtle.importKey('raw',encoder.encode(secret()),{name:'HMAC',hash:'SHA-256'},false,[usage])}
async function signature(value:string){const bytes=await crypto.subtle.sign('HMAC',await getKey('sign'),encoder.encode(value));return Buffer.from(bytes).toString('base64url')}
async function validSignature(value:string,provided:string){return crypto.subtle.verify('HMAC',await getKey('verify'),Buffer.from(provided,'base64url'),encoder.encode(value))}
export async function createSession(payload:Omit<ReaderSessionPayload,'expiresAt'>){const session={...payload,expiresAt:Date.now()+MAX_AGE*1000};const body=encode(JSON.stringify(session));(await cookies()).set(COOKIE_NAME,`${body}.${await signature(body)}`,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:MAX_AGE,priority:'high'})}
export async function getSession():Promise<ReaderSessionPayload|null>{const token=(await cookies()).get(COOKIE_NAME)?.value;if(!token)return null;try{const[body,sig,...extra]=token.split('.');if(!body||!sig||extra.length||!await validSignature(body,sig))return null;const value=JSON.parse(decode(body)) as ReaderSessionPayload;if(typeof value.userId!=='string'||typeof value.email!=='string'||typeof value.expiresAt!=='number')return null;return value.expiresAt>Date.now()?value:null}catch{return null}}
export async function deleteSession(){(await cookies()).delete(COOKIE_NAME)}
