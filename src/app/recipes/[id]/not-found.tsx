import Link from "next/link";

export default function RecipeNotFound() {
  return (
    <div className="card space-y-4">
      <h1 className="font-serif text-3xl text-olive">That recipe is not in the book</h1>
      <p className="text-lg text-muted">
        It may have been removed. Head back to the family collection and try another name.
      </p>
      <Link href="/recipes" className="btn-primary">
        Back to recipes
      </Link>
    </div>
  );
}
