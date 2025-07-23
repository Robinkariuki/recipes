// types/recipe.ts

export interface Ingredient {
  id: number;
  original: string;
  measures?: {
    metric?: {
      amount: number;
      unitShort: string;
    };
    us?: {
      amount: number;
      unitShort: string;
    };
  };
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  summary?: string;
  instructions?: string;
  readyInMinutes?: number;
  servings?: number;
  extendedIngredients: Ingredient[];
}