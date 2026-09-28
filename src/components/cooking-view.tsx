"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/lib/recipes";
import { RecipeFacts } from "@/components/recipe-facts";

type Checks = {
  ingredients: Record<string, boolean>;
  steps: Record<string, boolean>;
};

const emptyChecks: Checks = { ingredients: {}, steps: {} };

function storageKey(userId: string, recipeId: string) {
  return `family-recipe-book:${userId}:${recipeId}`;
}

export function CookingView({
  recipe,
  userId,
}: {
  recipe: Recipe;
  userId: string;
}) {
  const [checks, setChecks] = useState<Checks>(emptyChecks);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<"steps" | "ingredients" | "kitchenware">("steps");
  const key = storageKey(userId, recipe.id);

  useEffect(() => {
    const saved = window.localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Checks;
        setChecks({
          ingredients: parsed.ingredients ?? {},
          steps: parsed.steps ?? {},
        });
      } catch {
        setChecks(emptyChecks);
      }
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(key, JSON.stringify(checks));
  }, [checks, key, ready]);

  const finishedSteps = recipe.steps.filter((step) => checks.steps[step.id]).length;

  function toggle(group: keyof Checks, id: string) {
    setChecks((current) => ({
      ...current,
      [group]: { ...current[group], [id]: !current[group][id] },
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
            Cooking view
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {recipe.title}
          </h1>
          <p className="text-xl text-muted">From {recipe.source_name}</p>
          <RecipeFacts servings={recipe.servings} cookTime={recipe.cook_time} />
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <p className="text-lg font-semibold text-olive">
            {finishedSteps} of {recipe.steps.length} steps done
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setChecks(emptyChecks)}
            >
              Clear checks
            </button>
            <Link href={`/recipes/${recipe.id}`} className="btn-secondary">
              Recipe details
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:hidden">
        {(
          [
            ["steps", "Steps"],
            ["ingredients", "Ingredients"],
            ["kitchenware", "Kitchenware"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={panel === value ? "btn-primary" : "btn-secondary"}
            onClick={() => setPanel(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className={`space-y-6 ${panel === "steps" ? "hidden sm:block" : ""}`}>
          <section className={`card space-y-4 ${panel === "kitchenware" ? "hidden sm:block" : ""}`}>
            <h2 className="font-serif text-2xl">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((item) => (
                <li key={item.id}>
                  <label className="flex min-h-14 cursor-pointer items-start gap-3 text-lg leading-snug">
                    <input
                      type="checkbox"
                      className="cook-check"
                      checked={Boolean(checks.ingredients[item.id])}
                      onChange={() => toggle("ingredients", item.id)}
                    />
                    <span className={checks.ingredients[item.id] ? "text-muted line-through" : ""}>
                      <span className="font-semibold">{item.quantity}</span> {item.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
          <section className={`card space-y-4 ${panel === "ingredients" ? "hidden sm:block" : ""}`}>
            <h2 className="font-serif text-2xl">Kitchenware</h2>
            <ul className="space-y-2 text-lg">
              {recipe.kitchenware.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className={`space-y-4 ${panel === "steps" ? "" : "hidden sm:block"}`}>
          <h2 className="font-serif text-3xl">Steps</h2>
          <p className="text-lg text-muted">
            Check a step when you finish it. Your place stays on this device.
          </p>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={step.id} className="card">
                <label className="flex cursor-pointer gap-4">
                  <input
                    type="checkbox"
                    className="cook-check mt-1"
                    checked={Boolean(checks.steps[step.id])}
                    onChange={() => toggle("steps", step.id)}
                  />
                  <span>
                    <span className="block font-serif text-2xl text-olive">
                      Step {index + 1}
                    </span>
                    <span
                      className={`mt-2 block text-xl leading-relaxed ${
                        checks.steps[step.id] ? "text-muted line-through" : "text-ink"
                      }`}
                    >
                      {step.instruction}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
