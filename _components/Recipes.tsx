'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import RecipeCard from './recipe_card';
import { Recipe } from '@/_utils/types/types';
import { fetchRandomRecipes } from '@/hooks/useRandomRecipes';

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [highlight, setHighlight] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Load recipes when page changes
useEffect(() => {
  const loadRecipes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newRecipes = await fetchRandomRecipes({ number: 8 });

      // If it's the first page and highlight not yet set
      if (page === 1 && !highlight) {
        const date = new Date().toISOString().split('T')[0];
        const hash = Array.from(date).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = hash % newRecipes.length;
        setHighlight(newRecipes[index]);

        // Remove the highlight from the list
        const filtered = newRecipes.filter((_, i) => i !== index);
        setAllRecipes(filtered);
      } else {
        setAllRecipes((prev) => [...prev, ...newRecipes]);
      }
    } catch (error: any) {
      console.error('Failed to fetch recipes:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  loadRecipes();
}, [page]);


  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading]);

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
          {/* Scroll Down Indicator */}
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

      {/* Infinite scroll loader */}
      <div ref={loaderRef} className="flex justify-center items-center mt-8 h-20">
        {isLoading && (
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
