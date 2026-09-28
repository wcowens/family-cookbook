"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { renameBook } from "@/app/books/actions";
import { CreateBookForm } from "@/components/create-book-form";
import type { RecipeBook } from "@/lib/books";
import { SHELF_STAINS, type ShelfStainId } from "@/lib/themes";

const STORAGE_KEY = "family-recipe-book:shelf-stain";

function chunkBooks<T>(books: T[], size: number) {
  const rows: T[][] = [];
  for (let index = 0; index < books.length; index += size) {
    rows.push(books.slice(index, index + size));
  }
  return rows.length > 0 ? rows : [[]];
}

function spineSize(name: string) {
  const width = 46 + (name.length % 4) * 10;
  const height = 230 + (name.length % 5) * 16;
  return { width, height };
}

export function Bookshelf({
  books,
  userId,
}: {
  books: RecipeBook[];
  userId: string;
}) {
  const [stain, setStain] = useState<ShelfStainId>("honey");
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const wood = SHELF_STAINS[stain];

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && saved in SHELF_STAINS) {
      setStain(saved as ShelfStainId);
    }
  }, []);

  function chooseStain(id: ShelfStainId) {
    setStain(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  const rows = chunkBooks(books, 8);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[#5c4632]">Wood stain</p>
          {Object.entries(SHELF_STAINS).map(([id, item]) => (
            <button
              key={id}
              type="button"
              className="rounded-full px-3 py-2 text-sm font-semibold text-white"
              style={{
                background: item.plank,
                outline: stain === id ? "3px solid #fffaf4" : undefined,
                outlineOffset: 2,
              }}
              onClick={() => chooseStain(id as ShelfStainId)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={() => setCreating((open) => !open)}>
          {creating ? "Close" : "Create a book"}
        </button>
      </div>

      {creating ? (
        <div className="card">
          <CreateBookForm />
        </div>
      ) : null}

      <div
        className="bookcase"
        style={{
          background: `linear-gradient(180deg, ${wood.wall} 0%, #f3e6cf 100%)`,
        }}
      >
        {books.length === 0 ? (
          <p className="px-4 py-16 text-center font-serif text-2xl text-[#5c4632]">
            This shelf is waiting for its first book.
          </p>
        ) : (
          rows.map((row, rowIndex) => (
            <div key={rowIndex} className="shelf-row">
              <ul className="shelf-books">
                {row.map((book) => {
                  const size = spineSize(book.name);
                  const owned = book.created_by === userId;
                  return (
                    <li key={book.id} className="shelf-book">
                      {renamingId === book.id ? (
                        <form action={renameBook} className="spine-rename-form" style={{ height: size.height }}>
                          <input type="hidden" name="bookId" value={book.id} />
                          <label className="sr-only" htmlFor={`rename-${book.id}`}>
                            Book name
                          </label>
                          <input
                            id={`rename-${book.id}`}
                            name="name"
                            defaultValue={book.name}
                            required
                            className="field-input"
                          />
                          <button type="submit" className="btn-primary px-3">
                            Save
                          </button>
                          <button type="button" className="btn-secondary px-3" onClick={() => setRenamingId(null)}>
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <Link
                            href={`/books/${book.id}`}
                            className="shelf-spine"
                            style={{
                              background: book.cover_color,
                              width: size.width,
                              height: size.height,
                            }}
                          >
                            <span className="shelf-spine-title">{book.name}</span>
                          </Link>
                          {owned ? (
                            <button
                              type="button"
                              className="spine-rename"
                              onClick={() => setRenamingId(book.id)}
                            >
                              Rename
                            </button>
                          ) : null}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div
                className="shelf-plank"
                style={{
                  background: `linear-gradient(180deg, ${wood.plank} 0%, ${wood.plankDark} 100%)`,
                }}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
