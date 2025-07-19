'use client';

import { useEffect, useState } from "react";
import { useMealPlanner } from "@/contexts/MealPlannerContext";
import { Recipe } from "@/_utils/types/types"; // Adjust the import path as necessary
import RecipeCard from "@/_components/recipe_card";
import { PlannedMeal } from "@/contexts/MealPlannerContext";
import { toast } from "react-toastify";

export default function MealPlannerPage() {
  const { plannedMeals, removeMeal } = useMealPlanner();
  const [hasMounted, setHasMounted] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeMealIndex, setActiveMealIndex] = useState<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const mealsForSelectedDate = plannedMeals.filter(
    (meal) => meal.date === selectedDate
  );

  const handleMealClick = (index: number) => {
    setActiveMealIndex((prev) => (prev === index ? null : index));
  };

  const handleRemove = (meal: PlannedMeal) => {
    removeMeal(meal.mealId, meal.date, meal.time);
    setActiveMealIndex(null);
    toast.success("Meal removed successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800">📅 Your Meal Plan</h1>

        {/* Date Picker */}
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setActiveMealIndex(null);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            placeholder="Select date"
          />
        </div>
      </div>

      {mealsForSelectedDate.length === 0 ? (
        <p className="text-gray-600">No meals planned for {selectedDate}.</p>
      ) : (
        <>
          {/* List of meal titles and times */}
          <ul className="space-y-2">
            {mealsForSelectedDate.map((meal, index) => (
              <li
                key={index}
                onClick={() => handleMealClick(index)}
                className={`cursor-pointer px-4 py-2 rounded hover:bg-gray-100 text-gray-700 ${
                  activeMealIndex === index ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                🍽️ {meal.recipe?.title || "Untitled Meal"} — 🕒 {meal.time}
              </li>
            ))}
          </ul>

          {/* Recipe Card shown after selection */}
          {activeMealIndex !== null && (
            <div className="max-w-3xl mx-auto mt-6">
              <RecipeCard
                recipe={mealsForSelectedDate[activeMealIndex].recipe}
                showAddToPlanner={true}
                onRemove={() => handleRemove(mealsForSelectedDate[activeMealIndex])}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
