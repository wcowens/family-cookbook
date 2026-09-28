import Link from "next/link";
import { Bookshelf } from "@/components/bookshelf";
import { claimInvites, listBooks, searchAllBooks } from "@/lib/books";
import { getAuthUser } from "@/lib/auth";

export default async function RecipeCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  await claimInvites();
  const user = await getAuthUser();
  const [books, matches] = await Promise.all([
    listBooks(),
    query ? searchAllBooks(query) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a5a38]">
          Welcome home
        </p>
        <h1 className="font-serif text-4xl text-[#3b2918] sm:text-5xl">Your bookshelf</h1>
        <p className="max-w-xl text-lg text-[#5c4632]">
          Pull a book from the shelf. Each spine is a cookbook you can open, share, and cook from.
        </p>
      </div>

      <form method="get" action="/recipes" className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full space-y-2">
          <label htmlFor="all-books-search" className="field-label">
            Search all your cookbooks
          </label>
          <input
            id="all-books-search"
            name="q"
            defaultValue={query}
            placeholder="taco, ramen, curry, rigatoni"
            className="field-input"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {query ? (
        <section className="card space-y-3">
          <h2 className="font-serif text-2xl">
            {matches.length === 0 ? "No recipes matched" : `${matches.length} recipes`}
          </h2>
          {matches.length === 0 ? (
            <p className="text-muted">
              Try another cuisine word, such as taco, sushi, soup, or pancake.
            </p>
          ) : (
            <ul className="space-y-2">
              {matches.map((recipe) => (
                <li key={recipe.id}>
                  <Link
                    href={`/books/${recipe.book_id}?recipe=${recipe.id}`}
                    className="block rounded-2xl border border-line px-4 py-3 hover:border-olive"
                  >
                    <span className="block font-serif text-xl">{recipe.title}</span>
                    <span className="text-muted">In {recipe.book_name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <Bookshelf books={books} userId={user?.id ?? ""} />
    </div>
  );
}
