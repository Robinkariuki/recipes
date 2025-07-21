'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import RecipeCard from './recipe_card';
import { Recipe } from '@/_utils/types/types';
import { useRandomRecipes } from '@/hooks/useRandomRecipes';
import { useMealPlanner } from '@/contexts/MealPlannerContext';
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchRecipes } from '@/hooks/useSearchRecipes';

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [highlight, setHighlight] = useState<Recipe | null>(null);
  const [page, setPage] = useState(1);
  const { searchTerm } = useMealPlanner();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchRecipes(debouncedSearchTerm);

  const {
    data: randomRecipes = [],
    isLoading: isRandomLoading,
    error: randomError,
  } = useRandomRecipes({ number: 8 }, !searchTerm); // enabled only when not searching

  // Reset when exiting search
  useEffect(() => {
    if (!searchTerm) {
      setAllRecipes([]);
      setHighlight(null);
      setPage(1);
    }
  }, [searchTerm]);

  // Set highlight and recipe list from random API results
  useEffect(() => {
    if (searchTerm || !randomRecipes.length) return;

    const date = new Date().toISOString().split("T")[0];
    const hash = Array.from(date).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % randomRecipes.length;
    const picked = randomRecipes[index];

    setHighlight(picked);
    setAllRecipes(randomRecipes.filter((_, i) => i !== index));
  }, [randomRecipes, searchTerm]);

  // Infinite scroll for non-search state
  useEffect(() => {
    if (searchTerm) return;

    const node = loaderRef.current;
    if (!node) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1); // Currently unused, can hook into pagination
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(node);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [searchTerm]);

  const displayRecipes = useMemo(() => {
    if (searchTerm) return Array.isArray(searchResults) ? searchResults : [];
    return allRecipes;
  }, [searchTerm, searchResults, allRecipes]);

  return (
    <div className="p-6 space-y-12">
      {/* Highlight Section */}
      {!searchTerm && highlight && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">🌟 Highlight of the Day</h2>
          <div className="flex flex-col lg:flex-row lg:justify-start">
            <div className="w-full lg:w-1/2">
              <RecipeCard recipe={highlight} />
            </div>
          </div>
        </section>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Empty State */}
      {displayRecipes.length === 0 && !isSearchLoading && !isRandomLoading && (
        <p className="text-center text-gray-500 mt-6">No recipes found.</p>
      )}

      {/* Scroll Indicator */}
      {!searchTerm && (
        <div className="flex justify-center mt-4">
          <svg
            className="w-6 h-6 text-gray-500 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Loader */}
      {!searchTerm && (
        <div ref={loaderRef} className="flex justify-center items-center mt-8 h-20">
          {(isRandomLoading || isSearchLoading) && (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}

      {/* Errors */}
      {searchError && <p className="text-red-500 text-center mt-4">{searchError.message}</p>}
      {randomError && <p className="text-red-500 text-center mt-4">{randomError.message}</p>}
    </div>
  );
}
