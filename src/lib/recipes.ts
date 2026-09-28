import { createClient } from "@/lib/supabase/server";

export type Ingredient = {
  id: string;
  quantity: string;
  name: string;
  position: number;
};

export type KitchenwareItem = {
  id: string;
  name: string;
  position: number;
};

export type CookingStep = {
  id: string;
  instruction: string;
  position: number;
};

export type RecipeSummary = {
  id: string;
  user_id: string;
  title: string;
  source_name: string;
  servings: string;
  cook_time: string;
};

export type Recipe = RecipeSummary & {
  ingredients: Ingredient[];
  kitchenware: KitchenwareItem[];
  steps: CookingStep[];
};

type RecipeRow = RecipeSummary & {
  recipe_ingredients: Ingredient[] | null;
  recipe_kitchenware: KitchenwareItem[] | null;
  recipe_steps: CookingStep[] | null;
};

function byPosition<T extends { position: number }>(items: T[] | null) {
  return [...(items ?? [])].sort((a, b) => a.position - b.position);
}

export async function listRecipes(query: string): Promise<RecipeSummary[]> {
  const supabase = await createClient();
  let request = supabase
    .from("recipes")
    .select("id, user_id, title, source_name, servings, cook_time")
    .order("title", { ascending: true });

  const trimmed = query.trim().replace(/[%_]/g, "");
  if (trimmed) {
    request = request.ilike("title", `%${trimmed}%`);
  }

  const { data, error } = await request;
  if (error) {
    throw new Error("Could not load recipes.");
  }

  return data ?? [];
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      id, user_id, title, source_name, servings, cook_time,
      recipe_ingredients (id, quantity, name, position),
      recipe_kitchenware (id, name, position),
      recipe_steps (id, instruction, position)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load that recipe.");
  }
  if (!data) {
    return null;
  }

  const row = data as RecipeRow;
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    source_name: row.source_name,
    servings: row.servings,
    cook_time: row.cook_time,
    ingredients: byPosition(row.recipe_ingredients),
    kitchenware: byPosition(row.recipe_kitchenware),
    steps: byPosition(row.recipe_steps),
  };
}
