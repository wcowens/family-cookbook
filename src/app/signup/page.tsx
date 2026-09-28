import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getAuthUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/recipes");
  }

  return (
    <div className="mx-auto max-w-lg">
      <AuthForm mode="signup" />
    </div>
  );
}
