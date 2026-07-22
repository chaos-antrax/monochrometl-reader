import { cookies } from "next/headers";
import type { ReaderSessionPayload } from "@/types/user";

const COOKIE_NAME = "mr_session";
const MAX_AGE = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();
function secret() {
  const value = process.env.READER_SESSION_SECRET;
  if (!value) throw new Error("READER_SESSION_SECRET is not configured.");
  return value;
}
function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}
function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}
async function signature(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(bytes).toString("base64url");
}
async function validSignature(value: string, provided: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(provided, "base64url"),
    encoder.encode(value),
  );
}
export async function createSession(
  payload: Omit<ReaderSessionPayload, "expiresAt">,
) {
  const session = { ...payload, expiresAt: Date.now() + MAX_AGE * 1000 };
  const body = encode(JSON.stringify(session));
  const token = `${body}.${await signature(body)}`;
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}
export async function getSession(): Promise<ReaderSessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !(await validSignature(body, sig))) return null;
  try {
    const value = JSON.parse(decode(body)) as ReaderSessionPayload;
    return value.expiresAt > Date.now() ? value : null;
  } catch {
    return null;
  }
}
export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}
