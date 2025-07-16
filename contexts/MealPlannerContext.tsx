'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Recipe } from '@/_components/Recipes';


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

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('plannedMeals');
    if (stored) setPlannedMeals(JSON.parse(stored));
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('plannedMeals', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const addMeal = (meal: PlannedMeal) => {
    setPlannedMeals((prev) => [...prev, meal]);
  };

  const removeMeal = (mealId: number, date: string, time: string) => {
    setPlannedMeals((prev) =>
      prev.filter((m) => !(m.mealId === mealId && m.date === date && m.time === time))
    );
  };

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
