// hooks/useSearchRecipes.ts
import { useQuery } from '@tanstack/react-query';
import { Recipe } from '@/_utils/types/types';

const fetchSearchRecipes = async (query: string): Promise<Recipe[]> => {
  const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch recipe details');
  }

  return data.recipes; // Full recipe objects with details
};

export const useSearchRecipes = (query: string) => {
  return useQuery({
    queryKey: ['searchRecipes', query],
    queryFn: () => fetchSearchRecipes(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
