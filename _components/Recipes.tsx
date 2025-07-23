'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import RecipeCard from './recipe_card';
import { Recipe } from '@/_utils/types/types';
import { useRandomRecipes } from '@/hooks/useRandomRecipes';
import { useMealPlanner } from '@/contexts/MealPlannerContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchRecipes } from '@/hooks/useSearchRecipes';
import { ChefHat, Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 dark:from-orange-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div ref={scrollRef} className="relative z-10 p-6 lg:p-8 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Discover Amazing
              <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Recipes
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {debouncedSearchTerm 
                ? `Search results for "${debouncedSearchTerm}"` 
                : 'Explore our curated collection of delicious recipes from around the world'
              }
            </p>
          </div>
        </div>

        {/* Search Loading Indicator */}
        {debouncedSearchTerm && isSearchLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl animate-ping opacity-20"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Searching recipes...</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Finding the perfect matches for you</p>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        {displayRecipes.length > 0 && (
          <div className="space-y-8">
            {/* Results Count */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {displayRecipes.length} recipe{displayRecipes.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {displayRecipes.length === 0 && !isSearchLoading && !isRandomLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No recipes found</h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md">
                {debouncedSearchTerm 
                  ? `We couldn't find any recipes matching "${debouncedSearchTerm}". Try adjusting your search.`
                  : 'No recipes available at the moment. Please try again later.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Load More Section */}
        {!searchTerm && accumulatedRecipes.length > 0 && (
          <div className="flex justify-center pt-8">
            {isRandomLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl animate-ping opacity-20"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading more recipes...</p>
              </div>
            ) : (
              <button
                aria-busy={isRandomLoading}
                onClick={handleLoadMore}
                type="button"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Load More Recipes
                </div>
              </button>
            )}
          </div>
        )}

        {/* Error States */}
        {(searchError || randomError) && (
          <div className="flex justify-center pt-8">
            <div className="max-w-md p-6 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-200/50 dark:border-red-800/50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Something went wrong</h3>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {searchError?.message || randomError?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}