import { notFound, redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { getAuthUser } from "@/lib/auth";
import { getBook } from "@/lib/books";

export default async function NewBookRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, book] = await Promise.all([getAuthUser(), getBook(id)]);
  if (!user) {
    redirect("/login");
  }
  if (!book) {
    notFound();
  }

  return <RecipeForm mode="create" bookId={book.id} />;
}
