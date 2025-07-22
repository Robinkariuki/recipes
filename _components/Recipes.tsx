'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import RecipeCard from './recipe_card';
import { Recipe } from '@/_utils/types/types';
import { useRandomRecipes } from '@/hooks/useRandomRecipes';
import { useMealPlanner } from '@/contexts/MealPlannerContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchRecipes } from '@/hooks/useSearchRecipes';

export default function RecipesPage() {
  const [page, setPage] = useState(1);
  const [accumulatedRecipes, setAccumulatedRecipes] = useState<Recipe[]>([]);
  const { searchTerm } = useMealPlanner();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Search API
  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchRecipes(debouncedSearchTerm);

  // Random recipes (paginated via `page`)
  const {
    data: newRandomRecipes = [],
    isLoading: isRandomLoading,
    error: randomError,
  } = useRandomRecipes({ number: 8, page }, !searchTerm);

  // Accumulate random recipes on page change
useEffect(() => {
  if (searchTerm || !newRandomRecipes.length) return;

  setAccumulatedRecipes((prev) => {
    const existingIds = new Set(prev.map((r) => r.id));
    const filteredNew = newRandomRecipes.filter((r) => !existingIds.has(r.id));
    return [...prev, ...filteredNew];
  });
}, [newRandomRecipes, searchTerm]);


  // Display logic
  const displayRecipes = useMemo(() => {
    return debouncedSearchTerm ? searchResults : accumulatedRecipes;
  }, [debouncedSearchTerm, searchResults, accumulatedRecipes]);

  // Handle Load More with smooth scroll retention
  const handleLoadMore = () => {
    const currentY = window.scrollY;
    setPage((prev) => prev + 1);
    setTimeout(() => window.scrollTo({ top: currentY, behavior: 'smooth' }), 100);
  };

  return (
    <div ref={scrollRef} className="p-6 space-y-12">
      {/* Search loading indicator */}
      {debouncedSearchTerm && isSearchLoading && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* No Results */}
      {displayRecipes.length === 0 && !isSearchLoading && !isRandomLoading && (
        <p className="text-center text-gray-500 mt-6">No recipes found.</p>
      )}

      {/* Load More Button (pagination) */}
      {!searchTerm && accumulatedRecipes.length > 0 && (
  <div className="flex justify-center mt-8">
    {isRandomLoading ? (
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      <button
      aria-busy={isRandomLoading}
        onClick={handleLoadMore}
        type="button"
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
      >
        Load More Recipes
      </button>
    )}
  </div>
)}


      {/* Errors */}
      {searchError && <p className="text-red-500 text-center mt-4">{searchError.message}</p>}
      {randomError && <p className="text-red-500 text-center mt-4">{randomError.message}</p>}
    </div>
  );
}
