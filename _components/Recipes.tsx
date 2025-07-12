'use client';

import RecipeCard from "./recipe_card";
import { useEffect, useState } from "react";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  tags: string[];
}

export default function Recipes({ recipes }: { recipes: Recipe[] }) {
  const [highlight, setHighlight] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!recipes || recipes.length === 0) return;
    const date = new Date().toDateString();
    const hash = Array.from(date).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % recipes.length;
    setHighlight(recipes[index]);
  }, [recipes]);

  const remainingRecipes = highlight
    ? recipes.filter((r) => r.id !== highlight.id)
    : recipes;

  return (
    <div className="p-6 space-y-12">
      {/* 🌟 Highlight Section */}
      {highlight && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">🌟 Highlight of the Day</h2>
          <div className="flex flex-col lg:flex-row lg:justify-start">
            <div className="w-full lg:w-1/2">
              <RecipeCard recipe={highlight} />
            </div>
          </div>
        </section>
      )}

      {/* 🍽️ All Other Recipes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {remainingRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
