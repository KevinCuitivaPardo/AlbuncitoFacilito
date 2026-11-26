"use client";

import { useActionState } from "react";
import { login, type AuthFormState } from "../actions/auth";
import { Field } from "../components/field";
import { SubmitButton } from "../components/submit-button";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.email ?? ""}
      />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" />
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <SubmitButton>Iniciar sesión</SubmitButton>
    </form>
  );
}
