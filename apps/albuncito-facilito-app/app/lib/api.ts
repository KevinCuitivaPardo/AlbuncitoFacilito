import "server-only";

// URL de la API (NestJS); solo se usa en el servidor
const API_URL = process.env.API_URL ?? "http://localhost:3001";

export interface User {
  id: number;
  name: string;
  slug: string;
  email: string;
}

export interface AuthResult {
  accessToken: string;
  user: User;
}

// status 0 significa que no se pudo conectar con la API
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number };

async function request<T>(path: string, init: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, cache: "no-store" });
    if (!response.ok) {
      return { ok: false, status: response.status };
    }
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: 0 };
  }
}

function postJson<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function signupRequest(name: string, email: string, password: string) {
  return postJson<AuthResult>("/auth/signup", { name, email, password });
}

export function loginRequest(email: string, password: string) {
  return postJson<AuthResult>("/auth/login", { email, password });
}

export function meRequest(token: string) {
  return request<User>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
