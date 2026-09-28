import Link from "next/link";
import { signOut } from "@/app/auth/actions";

export function SiteHeader({ email }: { email: string | null }) {
  return (
    <header className="border-b border-line bg-card/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={email ? "/recipes" : "/"} className="group min-w-0">
          <span className="block font-serif text-lg leading-tight text-olive sm:text-2xl">
            Family Recipe Book
          </span>
          <span className="block truncate text-sm text-muted">
            Recipes worth keeping
          </span>
        </Link>
        {email ? (
          <div className="flex items-center gap-3">
            <p className="hidden max-w-48 truncate text-sm text-muted sm:block">
              {email}
            </p>
            <form action={signOut}>
              <button type="submit" className="btn-secondary px-4">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <nav className="flex items-center gap-2">
            <Link href="/login" className="btn-secondary px-4">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary px-4">
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
