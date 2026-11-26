import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
// Misma duración que el JWT de la API (7 días)
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// El JWT vive en una cookie httpOnly: el JavaScript del navegador no puede leerlo
export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
