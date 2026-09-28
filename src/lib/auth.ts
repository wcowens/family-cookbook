import { createClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    return null;
  }

  const email = data.claims.email;
  return {
    id: data.claims.sub,
    email: typeof email === "string" ? email : null,
  };
}
