import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/lib/recipes";
import { byPosition } from "@/lib/recipes";
import { orderRecipes } from "@/lib/search";

export type RecipeBook = {
  id: string;
  name: string;
  theme: string;
  cover_color: string;
  paper_color: string;
  accent_color: string;
  created_by: string;
  recipe_count: number;
};

export type BookMember = {
  id: string;
  email: string;
  role: string;
  status: string;
};

type RecipeQueryRow = {
  id: string;
  user_id: string;
  book_id: string;
  title: string;
  source_name: string;
  servings: string;
  cook_time: string;
  search_text: string;
  recipe_ingredients: Recipe["ingredients"] | null;
  recipe_kitchenware: Recipe["kitchenware"] | null;
  recipe_steps: Recipe["steps"] | null;
};

export async function claimInvites() {
  const supabase = await createClient();
  await supabase.rpc("claim_book_invites");
}

export async function listBooks(): Promise<RecipeBook[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_books")
    .select("id, name, theme, cover_color, paper_color, accent_color, created_by, recipes(id)")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Could not load your books.");
  }

  return (data ?? []).map((book) => ({
    id: book.id,
    name: book.name,
    theme: book.theme,
    cover_color: book.cover_color,
    paper_color: book.paper_color,
    accent_color: book.accent_color,
    created_by: book.created_by,
    recipe_count: Array.isArray(book.recipes) ? book.recipes.length : 0,
  }));
}

export async function getBook(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_books")
    .select(
      `
      id, name, theme, cover_color, paper_color, accent_color, created_by,
      recipes (
        id, user_id, book_id, title, source_name, servings, cook_time, search_text,
        recipe_ingredients (id, quantity, name, position),
        recipe_kitchenware (id, name, position),
        recipe_steps (id, instruction, position)
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not open that book.");
  }
  if (!data) {
    return null;
  }

  const recipes = ((data.recipes ?? []) as RecipeQueryRow[])
    .map((row) => ({
      id: row.id,
      user_id: row.user_id,
      book_id: row.book_id,
      title: row.title,
      source_name: row.source_name,
      servings: row.servings,
      cook_time: row.cook_time,
      search_text: row.search_text,
      ingredients: byPosition(row.recipe_ingredients),
      kitchenware: byPosition(row.recipe_kitchenware),
      steps: byPosition(row.recipe_steps),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    id: data.id,
    name: data.name,
    theme: data.theme,
    cover_color: data.cover_color,
    paper_color: data.paper_color,
    accent_color: data.accent_color,
    created_by: data.created_by,
    recipes,
  };
}

export async function listBookMembers(bookId: string): Promise<BookMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("book_members")
    .select("id, email, role, status")
    .eq("book_id", bookId)
    .order("status", { ascending: true })
    .order("email", { ascending: true });

  if (error) {
    return [];
  }
  return data ?? [];
}

export type ShelfHit = {
  id: string;
  title: string;
  book_id: string;
  book_name: string;
  search_text: string;
};

export async function searchAllBooks(query: string): Promise<ShelfHit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, search_text, book_id, recipe_books(name)");

  if (error) {
    throw new Error("Could not search your books.");
  }

  const hits = (data ?? []).map((row) => {
    const related = row.recipe_books as { name: string } | { name: string }[] | null;
    const bookName = Array.isArray(related) ? related[0]?.name : related?.name;
    return {
      id: row.id,
      title: row.title,
      search_text: row.search_text,
      book_id: row.book_id,
      book_name: bookName ?? "Recipe book",
    };
  });

  return orderRecipes(hits, query);
}
