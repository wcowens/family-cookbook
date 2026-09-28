"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isHexColor, isThemeId, themeFor } from "@/lib/themes";

export type BookFormState = {
  error?: string;
  message?: string;
};

export async function createBook(
  _previous: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const user = await getAuthUser();
  if (!user?.email) {
    return { error: "Please sign in again." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const themeValue = String(formData.get("theme") ?? "olive");
  const coverValue = String(formData.get("coverColor") ?? "");
  const theme = isThemeId(themeValue) ? themeValue : "olive";
  const fallback = themeFor(theme);
  const cover = isHexColor(coverValue) ? coverValue : fallback.cover;
  const paper = isHexColor(String(formData.get("paperColor") ?? ""))
    ? String(formData.get("paperColor"))
    : fallback.paper;
  const accent = isHexColor(String(formData.get("accentColor") ?? ""))
    ? String(formData.get("accentColor"))
    : fallback.accent;

  if (!name) {
    return { error: "Give the book a name." };
  }

  const supabase = await createClient();
  const { data: book, error } = await supabase
    .from("recipe_books")
    .insert({
      name,
      theme,
      cover_color: cover,
      paper_color: paper,
      accent_color: accent,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !book) {
    return { error: "We could not create that book. Please try again." };
  }

  const { error: memberError } = await supabase.from("book_members").insert({
    book_id: book.id,
    user_id: user.id,
    email: user.email.toLowerCase(),
    role: "owner",
    status: "active",
  });

  if (memberError) {
    return { error: "The book was created, but we could not add you to it." };
  }

  revalidatePath("/recipes");
  redirect(`/books/${book.id}`);
}

export async function updateBookTheme(
  _previous: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Please sign in again." };
  }

  const bookId = String(formData.get("bookId") ?? "").trim();
  const themeValue = String(formData.get("theme") ?? "olive");
  const coverValue = String(formData.get("coverColor") ?? "");
  const theme = isThemeId(themeValue) ? themeValue : "olive";
  const fallback = themeFor(theme);
  const cover = isHexColor(coverValue) ? coverValue : fallback.cover;
  const paper = isHexColor(String(formData.get("paperColor") ?? ""))
    ? String(formData.get("paperColor"))
    : fallback.paper;
  const accent = isHexColor(String(formData.get("accentColor") ?? ""))
    ? String(formData.get("accentColor"))
    : fallback.accent;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_books")
    .update({ theme, cover_color: cover, paper_color: paper, accent_color: accent })
    .eq("id", bookId)
    .eq("created_by", user.id)
    .select("id");

  if (error || !data?.length) {
    return { error: "Only the person who created this book can change its colors." };
  }

  revalidatePath(`/books/${bookId}`);
  revalidatePath("/recipes");
  return { message: "Colors saved." };
}

export async function inviteToBook(
  _previous: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Please sign in again." };
  }

  const bookId = String(formData.get("bookId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) {
    return { error: "Enter the email address of the person you want to invite." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("invite_to_book", {
    p_book_id: bookId,
    p_email: email,
  });

  if (error) {
    if (/already a member/i.test(error.message)) {
      return { error: "That person is already in this book." };
    }
    if (/already invited/i.test(error.message)) {
      return { error: "An invite is already waiting for that email." };
    }
    if (/not allowed/i.test(error.message)) {
      return { error: "Only the person who created this book can invite people." };
    }
    return { error: "We could not send that invite. Please try again." };
  }

  revalidatePath(`/books/${bookId}`);
  if (data === "joined") {
    return { message: `${email} joined this book.` };
  }
  return {
    message: `${email} will join when they sign up with that email. Tell them to create an account.`,
  };
}

export async function renameBook(formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const bookId = String(formData.get("bookId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/recipes");
  }

  const supabase = await createClient();
  await supabase
    .from("recipe_books")
    .update({ name })
    .eq("id", bookId)
    .eq("created_by", user.id);

  revalidatePath("/recipes");
  revalidatePath(`/books/${bookId}`);
  redirect("/recipes");
}
