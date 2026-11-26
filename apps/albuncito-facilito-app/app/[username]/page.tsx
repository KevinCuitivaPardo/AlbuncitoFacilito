import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logout } from "../actions/auth";
import { getCurrentUser } from "../lib/auth";

export const metadata: Metadata = { title: "Dashboard | AlbuncitoFacilito" };

export default function DashboardPage({ params }: { params: Promise<{ username: string }> }) {
  // La sesión y la ruta se leen en cada petición, por eso van dentro de Suspense
  return (
    <Suspense fallback={<p className="p-6">Cargando…</p>}>
      <Dashboard params={params} />
    </Suspense>
  );
}

async function Dashboard({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getCurrentUser();
  // Cada usuario solo ve su propio dashboard
  if (user.slug !== username) {
    redirect(`/${user.slug}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Hola, {user.name}</h1>
      <p>Este es tu dashboard de AlbuncitoFacilito.</p>
      <form action={logout}>
        <button type="submit" className="rounded-md border border-zinc-400 px-4 py-2">
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
