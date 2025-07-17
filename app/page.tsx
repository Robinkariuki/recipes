import Recipes from "@/_components/Recipes";
import { Recipe } from "@/_components/Recipes";
import { getBaseUrl } from "@/_utils/baseurl";

export default async function Home() {
  const res = await fetch(`${getBaseUrl()}/recipes.json`, {
    cache: "no-store",
  });
  const recipes: Recipe[] = await res.json();

  return <Recipes recipes={recipes} />;
}
