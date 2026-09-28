"use client";

import { useActionState, useId, useState } from "react";
import Link from "next/link";
import { saveRecipe, type SaveState } from "@/app/recipes/actions";

type IngredientDraft = { quantity: string; name: string };
type KitchenwareDraft = { name: string };
type StepDraft = { instruction: string };

const initialState: SaveState = {};

export function RecipeForm({
  mode,
  recipeId,
  title = "",
  sourceName = "",
  servings = "",
  cookTime = "",
  ingredients = [{ quantity: "", name: "" }],
  kitchenware = [{ name: "" }],
  steps = [{ instruction: "" }],
}: {
  mode: "create" | "edit";
  recipeId?: string;
  title?: string;
  sourceName?: string;
  servings?: string;
  cookTime?: string;
  ingredients?: IngredientDraft[];
  kitchenware?: KitchenwareDraft[];
  steps?: StepDraft[];
}) {
  const formId = useId();
  const [ingredientRows, setIngredientRows] = useState(ingredients);
  const [kitchenwareRows, setKitchenwareRows] = useState(kitchenware);
  const [stepRows, setStepRows] = useState(steps);
  const [state, formAction, pending] = useActionState(saveRecipe, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {recipeId ? <input type="hidden" name="id" value={recipeId} /> : null}
      <input type="hidden" name="ingredients" value={JSON.stringify(ingredientRows)} />
      <input type="hidden" name="kitchenware" value={JSON.stringify(kitchenwareRows)} />
      <input type="hidden" name="steps" value={JSON.stringify(stepRows)} />

      <div className="space-y-2">
        <h1 className="font-serif text-4xl text-olive">
          {mode === "create" ? "Add a recipe" : "Edit this recipe"}
        </h1>
        <p className="text-lg text-muted">
          Write it the way you would explain it to someone cooking for the first time.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-terracotta" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="card space-y-5">
        <div className="space-y-2">
          <label htmlFor={`${formId}-title`} className="field-label">
            Recipe name
          </label>
          <input
            id={`${formId}-title`}
            name="title"
            defaultValue={title}
            required
            placeholder="Aunt Maria's pasta"
            className="field-input"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${formId}-source`} className="field-label">
            Relative it came from
          </label>
          <input
            id={`${formId}-source`}
            name="sourceName"
            defaultValue={sourceName}
            required
            placeholder="Aunt Maria"
            className="field-input"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={`${formId}-servings`} className="field-label">
              Servings
            </label>
            <input
              id={`${formId}-servings`}
              name="servings"
              defaultValue={servings}
              required
              placeholder="4"
              className="field-input"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor={`${formId}-cook-time`} className="field-label">
              Total cook time
            </label>
            <input
              id={`${formId}-cook-time`}
              name="cookTime"
              defaultValue={cookTime}
              required
              placeholder="45 minutes"
              className="field-input"
            />
          </div>
        </div>
      </div>

      <section className="card space-y-4">
        <div>
          <h2 className="font-serif text-2xl text-ink">Ingredients</h2>
          <p className="text-muted">Add one ingredient at a time, with how much you need.</p>
        </div>
        <ul className="space-y-3">
          {ingredientRows.map((row, index) => (
            <li key={`${formId}-ingredient-${index}`} className="grid gap-3 sm:grid-cols-[9rem_1fr_auto]">
              <div className="space-y-1">
                <label htmlFor={`${formId}-qty-${index}`} className="field-label">
                  Quantity
                </label>
                <input
                  id={`${formId}-qty-${index}`}
                  value={row.quantity}
                  onChange={(event) => {
                    const quantity = event.target.value;
                    setIngredientRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, quantity } : item,
                      ),
                    );
                  }}
                  placeholder="2 cups"
                  className="field-input"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`${formId}-ingredient-name-${index}`} className="field-label">
                  Ingredient
                </label>
                <input
                  id={`${formId}-ingredient-name-${index}`}
                  value={row.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setIngredientRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name } : item,
                      ),
                    );
                  }}
                  placeholder="flour"
                  className="field-input"
                />
              </div>
              <button
                type="button"
                className="btn-secondary self-end px-4"
                onClick={() =>
                  setIngredientRows((current) =>
                    current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                disabled={ingredientRows.length === 1}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            setIngredientRows((current) => [...current, { quantity: "", name: "" }])
          }
        >
          Add ingredient
        </button>
      </section>

      <section className="card space-y-4">
        <div>
          <h2 className="font-serif text-2xl text-ink">Kitchenware</h2>
          <p className="text-muted">Pots, pans, utensils, and anything else to set out first.</p>
        </div>
        <ul className="space-y-3">
          {kitchenwareRows.map((row, index) => (
            <li key={`${formId}-tool-${index}`} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-1">
                <label htmlFor={`${formId}-tool-${index}`} className="field-label">
                  Item {index + 1}
                </label>
                <input
                  id={`${formId}-tool-${index}`}
                  value={row.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setKitchenwareRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name } : item,
                      ),
                    );
                  }}
                  placeholder="large pot"
                  className="field-input"
                />
              </div>
              <button
                type="button"
                className="btn-secondary self-end px-4"
                onClick={() =>
                  setKitchenwareRows((current) =>
                    current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                disabled={kitchenwareRows.length === 1}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setKitchenwareRows((current) => [...current, { name: "" }])}
        >
          Add kitchenware
        </button>
      </section>

      <section className="card space-y-4">
        <div>
          <h2 className="font-serif text-2xl text-ink">Cooking steps</h2>
          <p className="text-muted">
            Include times, temperatures, and any tip a beginner would need.
          </p>
        </div>
        <ol className="space-y-3">
          {stepRows.map((row, index) => (
            <li key={`${formId}-step-${index}`} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={`${formId}-step-${index}`} className="field-label">
                  Step {index + 1}
                </label>
                <button
                  type="button"
                  className="btn-secondary px-4"
                  onClick={() =>
                    setStepRows((current) =>
                      current.length === 1
                        ? current
                        : current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  disabled={stepRows.length === 1}
                >
                  Remove
                </button>
              </div>
              <textarea
                id={`${formId}-step-${index}`}
                value={row.instruction}
                onChange={(event) => {
                  const instruction = event.target.value;
                  setStepRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, instruction } : item,
                    ),
                  );
                }}
                rows={3}
                placeholder="Boil the pasta for 10 minutes, then drain it."
                className="field-input min-h-24"
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setStepRows((current) => [...current, { instruction: "" }])}
        >
          Add step
        </button>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Saving..." : "Save recipe"}
        </button>
        <Link href={recipeId ? `/recipes/${recipeId}` : "/recipes"} className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
