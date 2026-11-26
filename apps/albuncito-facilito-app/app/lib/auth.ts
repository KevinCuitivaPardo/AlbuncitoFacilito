import "server-only";
import { redirect } from "next/navigation";
import { meRequest, type User } from "./api";
import { getSessionToken } from "./session";

// Usuario de la sesión actual; sin sesión válida redirige a /login.
// Siempre consulta la API, que es quien valida el JWT.
export async function getCurrentUser(): Promise<User> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  const result = await meRequest(token);
  if (!result.ok) {
    redirect("/login");
  }
  return result.data;
}
