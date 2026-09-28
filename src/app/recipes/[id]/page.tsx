import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeFacts } from "@/components/recipe-facts";
import { getAuthUser } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, recipe] = await Promise.all([getAuthUser(), getRecipe(id)]);
  if (!recipe) {
    notFound();
  }

  const canEdit = user?.id === recipe.user_id;

  return (
    <article className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
            From {recipe.source_name}
          </p>
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">{recipe.title}</h1>
          <RecipeFacts servings={recipe.servings} cookTime={recipe.cook_time} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/recipes/${recipe.id}/cook`} className="btn-primary">
            Start cooking
          </Link>
          {canEdit ? (
            <Link href={`/recipes/${recipe.id}/edit`} className="btn-secondary">
              Edit
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-4">
          <h2 className="font-serif text-2xl">Ingredients</h2>
          <ul className="space-y-2 text-lg">
            {recipe.ingredients.map((item) => (
              <li key={item.id}>
                <span className="font-semibold">{item.quantity}</span> {item.name}
              </li>
            ))}
          </ul>
        </section>
        <section className="card space-y-4">
          <h2 className="font-serif text-2xl">Kitchenware</h2>
          <ul className="space-y-2 text-lg">
            {recipe.kitchenware.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Instructions</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, index) => (
            <li key={step.id} className="card">
              <p className="font-serif text-xl text-olive">Step {index + 1}</p>
              <p className="mt-2 text-lg leading-relaxed">{step.instruction}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
