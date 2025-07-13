'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Recipe } from "./Recipes";
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useMealPlanner } from "@/contexts/MealPlannerContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { addMeal } = useMealPlanner();

  const fallbackImg = "https://placehold.co/300x200?text=No+Image";
  const [imgSrc, setImgSrc] = useState(fallbackImg);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);

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
      time
    });

    toast.success(`"${recipe.title}" added to Meal Planner!`);
    setDate('');
    setTime('');
    setOpen(false); // Close modal
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
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
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
        <p className="text-gray-600 text-sm">{recipe.description}</p>

        <div className="flex flex-wrap gap-1 text-xs">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <p><strong>Prep:</strong> {recipe.prepTime}</p>
          <p><strong>Cook:</strong> {recipe.cookTime}</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-800">Ingredients:</h3>
          <ul className="list-disc pl-4 text-xs text-gray-700">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-800">Instructions:</h3>
          <ol className="list-decimal pl-4 text-xs text-gray-700 space-y-1">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        {/* ➕ Add to Planner Button */}
        <div className="pt-4 flex justify-center">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="bg-pink-600 text-white w-40 py-1.5 rounded text-sm hover:bg-pink-700 transition">
                + Add to Planner
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-lg font-semibold text-gray-800">
                    📅 Schedule this Meal
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-gray-500 hover:text-gray-800">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
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
        </div>
      </div>
    </div>
  );
}
