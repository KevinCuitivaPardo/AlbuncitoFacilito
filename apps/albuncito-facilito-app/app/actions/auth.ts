"use server";

import { redirect } from "next/navigation";
import { loginRequest, signupRequest, type ApiResult, type AuthResult } from "../lib/api";
import { createSession, deleteSession } from "../lib/session";

export interface AuthFormState {
  error?: string;
  // Valores enviados, para que React no vacíe los campos tras un error (nunca la contraseña)
  name?: string;
  email?: string;
}

const ERROR_MESSAGES: Record<number, string> = {
  0: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
  400: "Revisa los datos: nombre de 2 a 50 caracteres, un email válido y una contraseña de 8 o más caracteres.",
  401: "Email o contraseña incorrectos.",
  409: "Ese email ya está registrado.",
};

function errorMessage(status: number): string {
  return ERROR_MESSAGES[status] ?? "Ocurrió un error inesperado. Inténtalo de nuevo.";
}

const readField = (formData: FormData, field: string) => String(formData.get(field) ?? "");

// Guarda el JWT en la cookie y lleva al usuario a su dashboard (/slug)
async function finishAuth(
  result: ApiResult<AuthResult>,
  submitted: Pick<AuthFormState, "name" | "email">,
): Promise<AuthFormState> {
  if (!result.ok) {
    return { error: errorMessage(result.status), ...submitted };
  }
  await createSession(result.data.accessToken);
  redirect(`/${result.data.user.slug}`);
}

export async function signup(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  return finishAuth(await signupRequest(name, email, readField(formData, "password")), { name, email });
}

export async function login(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = readField(formData, "email");
  return finishAuth(await loginRequest(email, readField(formData, "password")), { email });
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
