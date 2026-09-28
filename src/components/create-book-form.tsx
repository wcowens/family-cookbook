"use client";

import { useActionState } from "react";
import { createBook, type BookFormState } from "@/app/books/actions";
import { BookColorFields } from "@/components/book-color-fields";
import { themeFor } from "@/lib/themes";

const initialState: BookFormState = {};

export function CreateBookForm() {
  const [state, formAction, pending] = useActionState(createBook, initialState);
  const olive = themeFor("olive");

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="font-serif text-2xl">Create a book</h2>
      {state.error ? (
        <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-terracotta" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="book-name" className="field-label">
          Book name
        </label>
        <input id="book-name" name="name" required placeholder="Sunday dinners" className="field-input" />
      </div>
      <BookColorFields
        theme="olive"
        coverColor={olive.cover}
        paperColor={olive.paper}
        accentColor={olive.accent}
      />
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Creating..." : "Create book"}
      </button>
    </form>
  );
}
