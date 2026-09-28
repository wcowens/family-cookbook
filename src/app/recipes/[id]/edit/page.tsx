import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { getAuthUser } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";

export default async function EditRecipePage({
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
  if (recipe.user_id !== user.id) {
    return (
      <div className="card space-y-4">
        <h1 className="font-serif text-3xl text-olive">This recipe belongs to someone else</h1>
        <p className="text-lg text-muted">
          You can read it and cook from it. Only the person who added it can change the details.
        </p>
        <Link href={`/recipes/${recipe.id}`} className="btn-primary">
          Back to the recipe
        </Link>
      </div>
    );
  }

  return (
    <RecipeForm
      key={recipe.id}
      mode="edit"
      recipeId={recipe.id}
      bookId={recipe.book_id}
      title={recipe.title}
      sourceName={recipe.source_name}
      servings={recipe.servings === "Not listed" ? "" : recipe.servings}
      cookTime={recipe.cook_time === "Not listed" ? "" : recipe.cook_time}
      ingredients={recipe.ingredients.map((item) => ({
        quantity: item.quantity,
        name: item.name,
      }))}
      kitchenware={recipe.kitchenware.map((item) => ({ name: item.name }))}
      steps={recipe.steps.map((item) => ({ instruction: item.instruction }))}
    />
  );
}
