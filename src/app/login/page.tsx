import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getAuthUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; error?: string }>;
}) {
  const user = await getAuthUser();
  if (user) {
    redirect("/recipes");
  }

  const params = await searchParams;
  let notice: string | undefined;
  if (params.confirmed === "1") {
    notice = "Your email is confirmed. Log in with the same password.";
  } else if (params.error === "confirm") {
    notice =
      "We could not finish that link in this browser. If you already opened it, try logging in with your password.";
  }

  return (
    <div className="mx-auto max-w-lg">
      <AuthForm mode="login" notice={notice} />
    </div>
  );
}
