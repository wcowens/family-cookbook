"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SaveState = {
  error?: string;
};

function friendlySaveError(message: string) {
  if (/not authenticated/i.test(message)) {
    return "Please sign in again before saving.";
  }
  if (/not allowed/i.test(message)) {
    return "You can only edit recipes you added.";
  }
  return "We could not save that recipe. Please check the form and try again.";
}

export async function saveRecipe(
  _previous: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Please sign in again before saving." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const sourceName = String(formData.get("sourceName") ?? "").trim();
  const servings = String(formData.get("servings") ?? "").trim();
  const cookTime = String(formData.get("cookTime") ?? "").trim();
  const idValue = String(formData.get("id") ?? "").trim();
  const bookId = String(formData.get("bookId") ?? "").trim();

  let ingredients: { quantity: string; name: string }[] = [];
  let kitchenware: { name: string }[] = [];
  let steps: { instruction: string }[] = [];

  try {
    ingredients = JSON.parse(String(formData.get("ingredients") ?? "[]"));
    kitchenware = JSON.parse(String(formData.get("kitchenware") ?? "[]"));
    steps = JSON.parse(String(formData.get("steps") ?? "[]"));
  } catch {
    return { error: "Something went wrong with the form. Please try again." };
  }

  const cleanIngredients = ingredients
    .map((item) => ({
      quantity: String(item.quantity ?? "").trim(),
      name: String(item.name ?? "").trim(),
    }))
    .filter((item) => item.quantity || item.name);

  const cleanKitchenware = kitchenware
    .map((item) => ({ name: String(item.name ?? "").trim() }))
    .filter((item) => item.name);

  const cleanSteps = steps
    .map((item) => ({ instruction: String(item.instruction ?? "").trim() }))
    .filter((item) => item.instruction);

  if (!bookId) {
    return { error: "Choose a book for this recipe." };
  }
  if (!title) {
    return { error: "Add a recipe name." };
  }
  if (!sourceName) {
    return { error: "Add the relative this recipe came from." };
  }
  if (!servings) {
    return { error: "Add how many people this recipe serves." };
  }
  if (!cookTime) {
    return { error: "Add the total cook time." };
  }
  if (cleanIngredients.length === 0) {
    return { error: "Add at least one ingredient." };
  }
  if (cleanIngredients.some((item) => !item.quantity || !item.name)) {
    return { error: "Each ingredient needs both a quantity and a name." };
  }
  if (cleanKitchenware.length === 0) {
    return { error: "Add at least one piece of kitchenware." };
  }
  if (cleanSteps.length === 0) {
    return { error: "Add at least one cooking step." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("save_recipe", {
    p_id: idValue || null,
    p_book_id: bookId,
    p_title: title,
    p_source_name: sourceName,
    p_servings: servings,
    p_cook_time: cookTime,
    p_ingredients: cleanIngredients,
    p_kitchenware: cleanKitchenware,
    p_steps: cleanSteps,
  });

  if (error || !data) {
    return { error: friendlySaveError(error?.message ?? "") };
  }

  revalidatePath("/recipes");
  revalidatePath(`/books/${bookId}`);
  redirect(`/books/${bookId}?recipe=${data}`);
}

export async function deleteRecipe(formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  const bookId = String(formData.get("bookId") ?? "").trim();
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("user_id, book_id")
    .eq("id", id)
    .maybeSingle();

  if (!data || data.user_id !== user.id) {
    redirect(bookId ? `/books/${bookId}` : "/recipes");
  }

  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) {
    redirect(`/books/${data.book_id}?recipe=${id}`);
  }

  revalidatePath("/recipes");
  revalidatePath(`/books/${data.book_id}`);
  redirect(`/books/${data.book_id}`);
}
