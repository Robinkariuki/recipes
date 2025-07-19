import { useQuery } from "@tanstack/react-query";
import spoonacular from "@/_utils/spoonacular";
import { Recipe } from "@/_utils/types/types"; // Adjust the import path as necessary

interface FetchParams {
  tags?: string;
  exclude?: string;
  includeNutrition?: boolean;
  number?: number;
}

export const fetchRandomRecipes = async ({
  tags,
  exclude,
  includeNutrition = false,
  number = 10,
}: FetchParams): Promise<Recipe[]> => {
  const { data } = await spoonacular.get("/recipes/random", {
    params: {
      includeNutrition,
      "include-tags": tags,
      "exclude-tags": exclude,
      number,
    },
  });

  return data.recipes;
};

export const useRandomRecipes = (params: FetchParams) => {
  return useQuery({
    queryKey: ["randomRecipes", params],
    queryFn: () => fetchRandomRecipes(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
