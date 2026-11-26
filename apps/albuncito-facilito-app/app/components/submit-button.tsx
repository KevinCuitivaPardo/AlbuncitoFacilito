"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-foreground px-4 py-2 font-medium text-background disabled:opacity-60"
    >
      {pending ? "Enviando…" : children}
    </button>
  );
}
