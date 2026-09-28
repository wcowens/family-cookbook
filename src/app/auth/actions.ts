"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
  success?: boolean;
};

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signUp(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  if (!email || !email.includes("@")) {
    return { error: "Enter the email address you want to use." };
  }
  if (password.length < 6) {
    return { error: "Choose a password with at least 6 characters." };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();

  let { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error && /redirect/i.test(error.message)) {
    const retry = await supabase.auth.signUp({ email, password });
    error = retry.error;
  }

  if (error) {
    if (/already registered|already been registered|already exists/i.test(error.message)) {
      return {
        error: "That email already has an account. Sign in with the same password.",
      };
    }
    return { error: "We could not create the account. Please try again." };
  }

  return { success: true };
}

export async function signIn(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (/confirm/i.test(error.message)) {
      return {
        error:
          "Open the confirmation link in your email, then sign in with this password.",
      };
    }
    return { error: "Those details did not match. Check your email and password." };
  }

  redirect("/recipes");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
