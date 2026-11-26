import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export function Field({ label, name, ...inputProps }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        id={name}
        name={name}
        required
        className="rounded-md border border-zinc-400 bg-transparent px-3 py-2 text-base font-normal"
        {...inputProps}
      />
    </label>
  );
}
