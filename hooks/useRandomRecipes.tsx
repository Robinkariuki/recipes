// hooks/useRandomRecipes.ts
import { useQuery } from '@tanstack/react-query';
import { Recipe } from '@/_utils/types/types';

interface FetchParams {
  tags?: string;
  exclude?: string;
  includeNutrition?: boolean;
  number?: number;
  page?: number;
}

export const fetchRandomRecipes = async ({
  tags,
  exclude,
  includeNutrition = false,
  number = 10,
}: FetchParams): Promise<Recipe[]> => {
  const query = new URLSearchParams({
    ...(tags ? { tags } : {}),
    ...(exclude ? { exclude } : {}),
    includeNutrition: String(includeNutrition),
    number: String(number),
  });

  const res = await fetch(`/api/recipes/random?${query.toString()}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch');
  }

  const data = await res.json();
  return data.recipes;
};

export const useRandomRecipes = (params: FetchParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['randomRecipes', params.page],
    queryFn: () => fetchRandomRecipes(params),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled,
  });
};
