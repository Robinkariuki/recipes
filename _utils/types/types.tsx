// types/recipe.ts

export interface Recipe {
  id: number;
  title: string;
  image: string;
  summary?: string;
  instructions?: string;
  readyInMinutes?: number;
  servings?: number;
  extendedIngredients: {
    original: string;
  }[];
}
