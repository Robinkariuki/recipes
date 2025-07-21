import { useQuery } from "@tanstack/react-query";
import spoonacular from "@/_utils/spoonacular";
import { Recipe } from "@/_utils/types/types";

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
  try {
    const { data } = await spoonacular.get("/recipes/random", {
      params: {
        includeNutrition,
        "include-tags": tags,
        "exclude-tags": exclude,
        number,
      },
    });

    return data.recipes;
  } catch (err: any) {
    if (err.response?.status === 402) {
      throw new Error("API quota exceeded. Please try again later.");
    }
    throw err;
  }
};

export const useRandomRecipes = (
  params: FetchParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["randomRecipes", params],
    queryFn: () => fetchRandomRecipes(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled,
  });
};
