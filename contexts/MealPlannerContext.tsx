'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Recipe } from '@/_utils/types/types'; // Adjust the import path as necessary

export interface PlannedMeal {
  mealId: number;
  date: string;
  time: string;
  recipe: Recipe;
}

interface MealPlannerContextType {
  plannedMeals: PlannedMeal[];
  addMeal: (meal: PlannedMeal) => void;
  removeMeal: (mealId: number, date: string, time: string) => void;
}

const MealPlannerContext = createContext<MealPlannerContextType | undefined>(undefined);

export const MealPlannerProvider = ({ children }: { children: ReactNode }) => {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('plannedMeals');
    if (stored) {
      try {
        setPlannedMeals(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing planned meals from localStorage:', error);
      }
    }
    setHydrated(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('plannedMeals', JSON.stringify(plannedMeals));
    }
  }, [plannedMeals, hydrated]);

  const addMeal = (meal: PlannedMeal) => {
    setPlannedMeals((prev) => {
      const exists = prev.some(
        (m) => m.mealId === meal.mealId && m.date === meal.date && m.time === meal.time
      );
      if (exists) return prev;
      return [...prev, meal];
    });
  };

  const removeMeal = (mealId: number, date: string, time: string) => {
    setPlannedMeals((prev) =>
      prev.filter((m) => !(m.mealId === mealId && m.date === date && m.time === time))
    );
  };

  if (!hydrated) return null;

  return (
    <MealPlannerContext.Provider value={{ plannedMeals, addMeal, removeMeal }}>
      {children}
    </MealPlannerContext.Provider>
  );
};

export const useMealPlanner = () => {
  const context = useContext(MealPlannerContext);
  if (!context) {
    throw new Error('useMealPlanner must be used within a MealPlannerProvider');
  }
  return context;
};
