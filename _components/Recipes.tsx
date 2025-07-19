'use client';

import { useEffect, useMemo, useState } from 'react';
import RecipeCard from './recipe_card';
import { Recipe } from '@/_utils/types/types';
import { fetchRandomRecipes } from '@/hooks/useRandomRecipes';

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [highlight, setHighlight] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
useEffect(() => {
  const loadRecipes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newRecipes = await fetchRandomRecipes({ number: 8 });
      setAllRecipes((prev) => [...prev, ...newRecipes]);
    } catch (error: any) {
      console.error('Failed to fetch recipes:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  loadRecipes();
}, [page]);

// Separate effect to set highlight once on page 1
useEffect(() => {
  if (page === 1 && allRecipes.length > 0 && !highlight) {
    const date = new Date().toISOString().split('T')[0];
    const hash = Array.from(date).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % allRecipes.length;
    setHighlight(allRecipes[index]);
  }
}, [allRecipes, highlight, page]);

// right before return
const remainingRecipes = useMemo(() => {
  return highlight ? allRecipes.filter((r) => r.id !== highlight.id) : allRecipes;
}, [allRecipes, highlight]);



  return (
    <div className="p-6 space-y-12">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {remainingRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Load More Recipes'}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
