'use client';

import { useEffect, useState } from "react";
import { useMealPlanner } from "@/contexts/MealPlannerContext";
import { Recipe } from "@/_utils/types/types";
import RecipeCard from "@/_components/recipe_card";
import { PlannedMeal } from "@/contexts/MealPlannerContext";
import { toast } from "react-toastify";
import { 
  Calendar, 
  Clock, 
  ChefHat, 
  Utensils, 
  CalendarDays,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  AlertCircle,
  ArrowRight
} from "lucide-react";

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

  // Helper function to get meal period icon
  const getMealIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 11) return <Coffee className="w-4 h-4 text-amber-500" />;
    if (hour < 17) return <Sun className="w-4 h-4 text-yellow-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  // Helper function to get meal period label
  const getMealPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 11) return { label: 'Breakfast', color: 'from-amber-500 to-orange-500' };
    if (hour < 17) return { label: 'Lunch', color: 'from-yellow-500 to-amber-500' };
    return { label: 'Dinner', color: 'from-indigo-500 to-purple-500' };
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const isToday = dateString === today;
    const isYesterday = dateString === new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const isTomorrow = dateString === new Date(Date.now() + 86400000).toISOString().split("T")[0];
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    if (isTomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <CalendarDays className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Your Meal
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                Planner
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Plan, organize, and enjoy your culinary journey with perfectly scheduled meals
            </p>
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Select Date
                </h2>
              </div>

              {/* Enhanced Date Picker */}
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setActiveMealIndex(null);
                  }}
                  className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 focus:border-purple-500 block w-full pl-4 pr-10 py-3 shadow-sm transition-all hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meals Display Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          {mealsForSelectedDate.length === 0 ? (
            // Empty State
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  No meals planned
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  No meals scheduled for <span className="font-semibold">{formatDate(selectedDate)}</span>
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-600">
                  Start planning by adding recipes to your meal planner
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Meals Header */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                      <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Meals for {formatDate(selectedDate)}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {mealsForSelectedDate.length} meal{mealsForSelectedDate.length !== 1 ? 's' : ''} planned
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {mealsForSelectedDate.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-4">
                {mealsForSelectedDate.map((meal, index) => {
                  const mealPeriod = getMealPeriod(meal.time);
                  const isActive = activeMealIndex === index;
                  
                  return (
                    <div
                      key={index}
                      className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        isActive ? 'ring-2 ring-purple-500/50 shadow-xl scale-[1.02]' : ''
                      }`}
                    >
                      <div
                        onClick={() => handleMealClick(index)}
                        className="cursor-pointer p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-gradient-to-r ${mealPeriod.color} rounded-xl shadow-lg`}>
                            {getMealIcon(meal.time)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {meal.recipe?.title || "Untitled Meal"}
                              </h3>
                              <span className={`px-2 py-1 bg-gradient-to-r ${mealPeriod.color} text-white text-xs font-medium rounded-full`}>
                                {mealPeriod.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{meal.time}</span>
                              {meal.recipe?.readyInMinutes && (
                                <>
                                  <span>•</span>
                                  <span>{meal.recipe.readyInMinutes} min</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-2 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-purple-100 dark:bg-purple-900/50 rotate-90' 
                            : 'bg-gray-100 dark:bg-gray-700/50 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30'
                        }`}>
                          <ArrowRight className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-gray-400 group-hover:text-purple-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Recipe Card */}
              {activeMealIndex !== null && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Recipe Details
                      </h3>
                    </div>
                    <RecipeCard
                      recipe={mealsForSelectedDate[activeMealIndex].recipe}
                      showAddToPlanner={true}
                      onRemove={() => handleRemove(mealsForSelectedDate[activeMealIndex])}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}