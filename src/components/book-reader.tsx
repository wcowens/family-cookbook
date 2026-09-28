"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { RecipeFacts } from "@/components/recipe-facts";
import type { Recipe } from "@/lib/recipes";
import { themeFor } from "@/lib/themes";

type CoverPage = { kind: "cover" };
type RecipePage = { kind: "recipe"; recipe: Recipe };
type BookPage = CoverPage | RecipePage;

export function BookReader({
  bookId,
  bookName,
  themeId,
  coverColor,
  paperColor,
  accentColor,
  pages,
  initialIndex,
  query,
  userId,
}: {
  bookId: string;
  bookName: string;
  themeId: string;
  coverColor: string;
  paperColor: string;
  accentColor: string;
  pages: BookPage[];
  initialIndex: number;
  query: string;
  userId: string;
}) {
  const theme = themeFor(themeId);
  const [index, setIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(pages.length - 1, 0)),
  );
  const page = pages[index];
  const atStart = index <= 0;
  const atEnd = index >= pages.length - 1;

  return (
    <div className="space-y-5">
      <form method="get" action={`/books/${bookId}`} className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full space-y-2">
          <label htmlFor="book-search" className="field-label">
            Search this book
          </label>
          <input
            id="book-search"
            name="q"
            defaultValue={query}
            placeholder="taco, ramen, curry"
            className="field-input"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {pages.length === 0 ? (
        <div className="card space-y-3">
          <h2 className="font-serif text-2xl">No recipes matched</h2>
          <p className="text-muted">
            Try a cuisine word such as taco, ramen, curry, or rigatoni, or add the recipe to this book.
          </p>
          <Link href={`/books/${bookId}`} className="btn-secondary">
            Clear search
          </Link>
        </div>
      ) : (
        <div className="book-stage">
          <div className="book-spine" style={{ background: theme.edge }}>
            <span className="book-spine-title">{bookName}</span>
          </div>
          <article
            className="book-page"
            style={
              page?.kind === "cover"
                ? { background: coverColor, color: "#fffaf4" }
                : { background: paperColor, color: theme.ink }
            }
          >
            {page?.kind === "cover" ? (
              <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                <p className="text-sm uppercase tracking-[0.2em] opacity-80">Recipe book</p>
                <h1 className="mt-4 max-w-md font-serif text-5xl leading-tight">{bookName}</h1>
                <p className="mt-6 max-w-sm text-lg opacity-90">
                  Turn the page to cook from a recipe, or add a new one.
                </p>
              </div>
            ) : page?.kind === "recipe" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
                    From {page.recipe.source_name}
                  </p>
                  <h1 className="font-serif text-4xl leading-tight">{page.recipe.title}</h1>
                  <RecipeFacts servings={page.recipe.servings} cookTime={page.recipe.cook_time} />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <section>
                    <h2 className="font-serif text-2xl">Ingredients</h2>
                    <ul className="mt-3 space-y-1 text-lg">
                      {page.recipe.ingredients.map((item) => (
                        <li key={item.id}>
                          <span className="font-semibold">{item.quantity}</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h2 className="font-serif text-2xl">Kitchenware</h2>
                    <ul className="mt-3 space-y-1 text-lg">
                      {page.recipe.kitchenware.map((item) => (
                        <li key={item.id}>{item.name}</li>
                      ))}
                    </ul>
                  </section>
                </div>
                <section>
                  <h2 className="font-serif text-2xl">Steps</h2>
                  <ol className="mt-3 space-y-3">
                    {page.recipe.steps.map((step, stepIndex) => (
                      <li key={step.id}>
                        <span className="font-semibold">Step {stepIndex + 1}. </span>
                        {step.instruction}
                      </li>
                    ))}
                  </ol>
                </section>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/recipes/${page.recipe.id}/cook`} className="btn-primary">
                    Start cooking
                  </Link>
                  {page.recipe.user_id === userId ? (
                    <>
                      <Link href={`/recipes/${page.recipe.id}/edit`} className="btn-secondary">
                        Edit
                      </Link>
                      <DeleteRecipeButton recipeId={page.recipe.id} bookId={bookId} />
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>
        </div>
      )}

      {pages.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">
            {page?.kind === "cover"
              ? "Cover"
              : `Recipe ${pages[0]?.kind === "cover" ? index : index + 1} of ${
                  pages.filter((item) => item.kind === "recipe").length
                }`}
          </p>
          <div className="flex gap-3">
            <button type="button" className="btn-secondary" disabled={atStart} onClick={() => setIndex((current) => current - 1)}>
              Previous page
            </button>
            <button type="button" className="btn-primary" disabled={atEnd} onClick={() => setIndex((current) => current + 1)}>
              Next page
            </button>
          </div>
        </div>
      ) : null}

      <Link href={`/books/${bookId}/new`} className="btn-secondary">
        Add a recipe to this book
      </Link>
    </div>
  );
}
