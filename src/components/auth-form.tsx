"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthFormState } from "@/app/auth/actions";

const initialState: AuthFormState = {};

export function AuthForm({
  mode,
  notice,
}: {
  mode: "login" | "signup";
  notice?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);

  if (mode === "signup" && state.success) {
    return (
      <div className="card space-y-4">
        <h1 className="font-serif text-3xl text-olive">Check your email</h1>
        <p className="text-lg leading-relaxed text-ink">
          We sent a confirmation link. Open that link, then come back and log
          in with the same password.
        </p>
        <Link href="/login" className="btn-primary">
          Go to log in
        </Link>
      </div>
    );
  }

  const title = mode === "login" ? "Welcome back" : "Join the family book";
  const submitLabel = mode === "login" ? "Log in" : "Create account";

  return (
    <form action={formAction} className="card space-y-5">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-olive">{title}</h1>
        <p className="text-muted">
          {mode === "login"
            ? "Sign in to see the recipes your family has saved."
            : "Create an account with your email. You will confirm it from a link, then log in with this password."}
        </p>
      </div>

      {notice ? (
        <p className="rounded-2xl bg-olive/10 px-4 py-3 text-olive" role="status">
          {notice}
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-terracotta" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field-input"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={6}
          className="field-input"
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? "Please wait..." : submitLabel}
      </button>

      <p className="text-sm text-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-olive underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-olive underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
