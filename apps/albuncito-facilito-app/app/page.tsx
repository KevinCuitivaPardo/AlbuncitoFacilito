import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">AlbuncitoFacilito</h1>
      <p>Colecciona tus álbumes y lleva el control de tus stickers.</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded-md bg-foreground px-4 py-2 font-medium text-background">
          Iniciar sesión
        </Link>
        <Link href="/signup" className="rounded-md border border-zinc-400 px-4 py-2">
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
