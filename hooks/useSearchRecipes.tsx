// hooks/useSearchRecipes.ts
import { useQuery } from '@tanstack/react-query';
import spoonacular from '@/_utils/spoonacular';
import { Recipe } from '@/_utils/types/types';

export const fetchSearchRecipes = async (query: string): Promise<Recipe[]> => {
  const { data } = await spoonacular.get('/recipes/complexSearch', {
    params: {
      query,
      number: 10,
    },
  });

  const results = data.results;

  // Fetch full details for each result
  const detailed = await Promise.all(
    results.map(async (recipe: any) => {
      const res = await spoonacular.get(`/recipes/${recipe.id}/information`);
      return res.data;
    })
  );

  return detailed; // now each recipe has full details needed for RecipeCard
};

export const useSearchRecipes = (query: string) => {
  return useQuery({
    queryKey: ['searchRecipes', query],
    queryFn: () => fetchSearchRecipes(query),
    enabled: !!query && query.length > 2, // Only search if 3+ chars
    staleTime: 1000 * 60 * 5,
    retry: false, // Do not retry failed searches (helps with 402)
    
    

  });
};
