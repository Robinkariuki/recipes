'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Recipe } from "@/_utils/types/types";
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useMealPlanner } from "@/contexts/MealPlannerContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RecipeCard({
  recipe,
  showAddToPlanner = true,
  onRemove,
}: {
  recipe: Recipe;
  showAddToPlanner?: boolean;
  onRemove?: () => void;
}) {
  const { addMeal } = useMealPlanner();
  const fallbackImg = "https://placehold.co/300x200?text=No+Image";

  const [imgSrc, setImgSrc] = useState(fallbackImg);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [openPlanner, setOpenPlanner] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);

  useEffect(() => {
    setImgSrc(recipe.image || fallbackImg);
  }, [recipe.image]);

  const handleAddToPlanner = () => {
    if (!date || !time) {
      toast.warn("Please select both date and time.");
      return;
    }

    addMeal({
      mealId: recipe.id,
      date,
      time,
      recipe,
    });

    toast.success(`"${recipe.title}" added to Meal Planner!`);
    setDate('');
    setTime('');
    setOpenPlanner(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden flex flex-col h-full transition-colors">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={imgSrc}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
          onError={() => setImgSrc(fallbackImg)}
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{recipe.title}</h2>

        {/* Instructions now inline */}
        <div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Instructions:</h3>
          <div
            className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line prose dark:prose-invert max-h-40 overflow-y-auto"
            dangerouslySetInnerHTML={{
              __html: recipe.instructions || 'No instructions available.',
            }}
          />
        </div>

        {/* View Summary Button */}
        <Dialog.Root open={openSummary} onOpenChange={setOpenSummary}>
          <Dialog.Trigger asChild>
            <button className="text-sm text-blue-600 hover:underline mt-1">ℹ️ View Summary</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
                  ℹ️ Recipe Summary
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
              <div
                className="prose dark:prose-invert text-sm max-h-[60vh] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: recipe.summary || 'No summary available.' }}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Info */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
          <p><strong>Ready in:</strong> {recipe.readyInMinutes} min</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Ingredients:</h3>
          <ul className="list-disc pl-4 text-xs text-gray-700 dark:text-gray-300">
            {recipe.extendedIngredients.map((ing, idx) => (
              <li key={idx}>{ing.original}</li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        {(showAddToPlanner || onRemove) && (
          <div className="mt-auto pt-4">
            <div className="flex justify-center gap-4 flex-wrap">
              {showAddToPlanner && (
                <Dialog.Root open={openPlanner} onOpenChange={setOpenPlanner}>
                  <Dialog.Trigger asChild>
                    <button className="bg-pink-600 text-white w-40 py-1.5 rounded text-sm hover:bg-pink-700 transition">
                      + Add to Planner
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
                          📅 Schedule this Meal
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </Dialog.Close>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                        <button
                          onClick={handleAddToPlanner}
                          className="w-full bg-pink-600 text-white py-2 rounded text-sm hover:bg-pink-700"
                        >
                          Add to Meal Planner
                        </button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              )}

              {onRemove && (
                <button
                  onClick={onRemove}
                  className="bg-red-500 text-white w-40 py-1.5 rounded text-sm hover:bg-red-600 transition"
                >
                  Remove Meal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
