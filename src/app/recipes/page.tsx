import Link from "next/link";
import { RecipeFacts } from "@/components/recipe-facts";
import { listRecipes } from "@/lib/recipes";

export default async function RecipeCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const recipes = await listRecipes(query);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">Family recipes</h1>
          <p className="max-w-xl text-lg text-muted">
            Everyone who is signed in can browse the book. You can edit the recipes you add.
          </p>
        </div>
        <Link href="/recipes/new" className="btn-primary">
          Add recipe
        </Link>
      </div>

      <form action="/recipes" className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full space-y-2">
          <label htmlFor="recipe-search" className="field-label">
            Search by recipe name
          </label>
          <input
            id="recipe-search"
            name="q"
            defaultValue={query}
            placeholder="pasta"
            className="field-input"
          />
        </div>
        <button type="submit" className="btn-primary sm:mb-0">
          Search
        </button>
      </form>

      {recipes.length === 0 ? (
        <div className="card space-y-3">
          <h2 className="font-serif text-2xl text-olive">
            {query ? "No recipes matched that name" : "Your family book is ready for its first recipe"}
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            {query
              ? "Try a shorter word from the recipe name, or add it if it is not here yet."
              : "Add a recipe you are learning. Include the ingredients, the kitchenware, and the steps so the next cook can follow along."}
          </p>
          <Link href="/recipes/new" className="btn-primary">
            Add the first recipe
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/recipes/${recipe.id}`}
                className="card block h-full transition hover:border-olive"
              >
                <h2 className="font-serif text-2xl text-ink">{recipe.title}</h2>
                <p className="mt-2 text-lg text-muted">From {recipe.source_name}</p>
                <div className="mt-4">
                  <RecipeFacts servings={recipe.servings} cookTime={recipe.cook_time} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
