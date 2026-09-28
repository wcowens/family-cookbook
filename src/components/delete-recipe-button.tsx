"use client";

import { deleteRecipe } from "@/app/recipes/actions";

export function DeleteRecipeButton({
  recipeId,
  bookId,
}: {
  recipeId: string;
  bookId: string;
}) {
  return (
    <form
      action={deleteRecipe}
      onSubmit={(event) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={recipeId} />
      <input type="hidden" name="bookId" value={bookId} />
      <button type="submit" className="btn-secondary">
        Delete recipe
      </button>
    </form>
  );
}
