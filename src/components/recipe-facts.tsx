export function RecipeFacts({
  servings,
  cookTime,
}: {
  servings: string;
  cookTime: string;
}) {
  const servingsLabel =
    servings === "Not listed" ? "Servings not added yet" : `Serves ${servings}`;
  const cookLabel =
    cookTime === "Not listed" ? "Cook time not added yet" : cookTime;

  return (
    <dl className="flex flex-wrap gap-3 text-base">
      <div className="rounded-full bg-olive/10 px-4 py-2">
        <dt className="sr-only">Servings</dt>
        <dd className="font-semibold text-olive">{servingsLabel}</dd>
      </div>
      <div className="rounded-full bg-terracotta/10 px-4 py-2">
        <dt className="sr-only">Total cook time</dt>
        <dd className="font-semibold text-terracotta">{cookLabel}</dd>
      </div>
    </dl>
  );
}
