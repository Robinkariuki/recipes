'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe } from '@/_utils/types/types';

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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MealPlannerContext = createContext<MealPlannerContextType | null>(null);

export const MealPlannerProvider = ({ children }: { children: ReactNode }) => {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('plannedMeals');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse planned meals:', error);
      return [];
    }
  });

  // ✅ Add searchTerm state
  const [searchTerm, setSearchTerm] = useState('');

  // Persist meals to localStorage
  useEffect(() => {
    localStorage.setItem('plannedMeals', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const addMeal = (meal: PlannedMeal) => {
    setPlannedMeals((prev) => {
      const exists = prev.some(
        (m) => m.mealId === meal.mealId && m.date === meal.date && m.time === meal.time
      );
      return exists ? prev : [...prev, meal];
    });
  };

  const removeMeal = (mealId: number, date: string, time: string) => {
    setPlannedMeals((prev) =>
      prev.filter((m) => !(m.mealId === mealId && m.date === date && m.time === time))
    );
  };

  return (
    <MealPlannerContext.Provider value={{ plannedMeals, addMeal, removeMeal, searchTerm, setSearchTerm }}>
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
