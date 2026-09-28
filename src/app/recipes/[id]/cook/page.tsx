import { notFound, redirect } from "next/navigation";
import { CookingView } from "@/components/cooking-view";
import { getAuthUser } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";

export default async function CookRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, recipe] = await Promise.all([getAuthUser(), getRecipe(id)]);
  if (!user) {
    redirect("/login");
  }
  if (!recipe) {
    notFound();
  }

  return <CookingView recipe={recipe} userId={user.id} />;
}
