import { notFound } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { BookSettings } from "@/components/book-settings";
import { claimInvites, getBook, listBookMembers } from "@/lib/books";
import { getAuthUser } from "@/lib/auth";
import { orderRecipes } from "@/lib/search";

export default async function OpenBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; recipe?: string }>;
}) {
  const { id } = await params;
  const { q = "", recipe: recipeId = "" } = await searchParams;
  await claimInvites();
  const [user, book] = await Promise.all([getAuthUser(), getBook(id)]);
  if (!user || !book) {
    notFound();
  }

  const query = q.trim();
  const ordered = orderRecipes(book.recipes, query);
  const pages = [
    ...(query ? [] : [{ kind: "cover" as const }]),
    ...ordered.map((recipe) => ({ kind: "recipe" as const, recipe })),
  ];
  const matchIndex = pages.findIndex(
    (page) => page.kind === "recipe" && page.recipe.id === recipeId,
  );

  const isOwner = book.created_by === user.id;
  const members = isOwner ? await listBookMembers(book.id) : [];

  return (
    <div className="space-y-8">
      <BookReader
        key={`${query}:${recipeId}`}
        bookId={book.id}
        bookName={book.name}
        themeId={book.theme}
        coverColor={book.cover_color}
        paperColor={book.paper_color}
        accentColor={book.accent_color}
        pages={pages}
        initialIndex={matchIndex >= 0 ? matchIndex : 0}
        query={query}
        userId={user.id}
      />
      {isOwner ? (
        <BookSettings
          bookId={book.id}
          theme={book.theme}
          coverColor={book.cover_color}
          paperColor={book.paper_color}
          accentColor={book.accent_color}
          members={members}
        />
      ) : null}
    </div>
  );
}
