import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Iniciar sesión | AlbuncitoFacilito" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      <LoginForm />
      <p className="text-sm">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="underline">
          Crea una
        </Link>
      </p>
    </main>
  );
}
