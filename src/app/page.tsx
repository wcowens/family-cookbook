import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/recipes");
  }

  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
          A private cookbook for your family
        </p>
        <h1 className="font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Keep the recipes you are learning, all in one place.
        </h1>
        <p className="max-w-xl text-xl leading-relaxed text-muted">
          Save a relative&apos;s recipe with the ingredients, the pots and pans,
          and the steps. Then cook from a large, easy view on your phone.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="btn-primary">
            Start the family book
          </Link>
          <Link href="/login" className="btn-secondary">
            I already have an account
          </Link>
        </div>
      </div>
      <div className="card space-y-4">
        <h2 className="font-serif text-2xl text-olive">What you can do</h2>
        <ul className="space-y-3 text-lg leading-relaxed">
          <li>Add a recipe and say which relative it came from.</li>
          <li>List ingredients, quantities, and the kitchenware you need.</li>
          <li>Keep recipes in books and invite family to add their own.</li>
          <li>Search a book by ingredient, or try a pasta word like rigatoni.</li>
          <li>Cook with big steps and check them off as you go.</li>
        </ul>
      </div>
    </section>
  );
}
