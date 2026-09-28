const CUISINE_GROUPS = [
  [
    "pasta",
    "rigatoni",
    "penne",
    "spaghetti",
    "fettuccine",
    "macaroni",
    "noodle",
    "noodles",
    "linguine",
    "lasagna",
    "lasagne",
    "ravioli",
    "tortellini",
    "ziti",
    "orzo",
    "gnocchi",
    "farfalle",
    "rotini",
    "cavatappi",
  ],
  ["mexican", "taco", "tacos", "burrito", "burritos", "enchilada", "enchiladas", "salsa", "quesadilla", "quesadillas", "guacamole"],
  ["pizza", "risotto", "meatball", "meatballs", "marinara"],
  ["chinese", "stir fry", "stir-fry", "dumpling", "dumplings", "fried rice", "lo mein", "wonton", "wontons"],
  ["japanese", "sushi", "ramen", "teriyaki", "miso"],
  ["indian", "curry", "tikka", "naan", "masala", "dal"],
  ["thai", "pad thai", "satay", "curry"],
  ["burger", "burgers", "barbecue", "bbq", "mac and cheese", "chili", "casserole"],
  ["pancake", "pancakes", "waffle", "waffles", "omelette", "omelet", "french toast"],
  ["cake", "cookie", "cookies", "brownie", "brownies", "bread", "pie"],
  ["soup", "stew", "chowder", "bisque"],
  ["salad", "slaw"],
  ["seafood", "shrimp", "salmon", "fish", "crab", "tuna"],
];

function cleanTerm(value: string) {
  return value.trim().toLowerCase().replace(/[%_]/g, "");
}

function groupMatches(query: string, group: string[]) {
  return group.some(
    (word) =>
      query === word ||
      query.includes(word) ||
      (query.length >= 4 && word.startsWith(query)),
  );
}

export function searchTerms(query: string) {
  const cleaned = cleanTerm(query);
  if (!cleaned) {
    return [];
  }

  const terms = new Set([cleaned]);
  for (const group of CUISINE_GROUPS) {
    if (groupMatches(cleaned, group)) {
      for (const word of group) {
        terms.add(word);
      }
    }
  }
  return [...terms];
}

export function recipeMatches(
  recipe: { title: string; search_text: string },
  terms: string[],
) {
  const title = recipe.title.toLowerCase();
  const text = recipe.search_text.toLowerCase();
  return terms.some((term) => title.includes(term) || text.includes(term));
}

export function orderRecipes<T extends { title: string; search_text: string }>(
  recipes: T[],
  query: string,
) {
  const terms = searchTerms(query);
  const sorted = [...recipes].sort((a, b) => a.title.localeCompare(b.title));
  if (terms.length === 0) {
    return sorted;
  }

  const primary = cleanTerm(query);
  return sorted
    .filter((recipe) => recipeMatches(recipe, terms))
    .sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(primary) ? 0 : 1;
      const bExact = b.title.toLowerCase().includes(primary) ? 0 : 1;
      if (aExact !== bExact) {
        return aExact - bExact;
      }
      return a.title.localeCompare(b.title);
    });
}
