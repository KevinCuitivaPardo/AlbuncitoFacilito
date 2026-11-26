"use client";

import { useActionState } from "react";
import { signup, type AuthFormState } from "../actions/auth";
import { Field } from "../components/field";
import { SubmitButton } from "../components/submit-button";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Nombre"
        name="name"
        type="text"
        autoComplete="name"
        minLength={2}
        maxLength={50}
        defaultValue={state.name ?? ""}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.email ?? ""}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
      />
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <SubmitButton>Crear cuenta</SubmitButton>
    </form>
  );
}
