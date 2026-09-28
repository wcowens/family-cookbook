import { notFound, redirect } from "next/navigation";
import { getRecipe } from "@/lib/recipes";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) {
    notFound();
  }
  redirect(`/books/${recipe.book_id}?recipe=${recipe.id}`);
}
