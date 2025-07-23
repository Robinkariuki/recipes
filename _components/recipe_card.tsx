'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Recipe } from '@/_utils/types/types';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Clock, Users, ChefHat, Calendar, Info, Trash2, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useMealPlanner } from '@/contexts/MealPlannerContext';
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
  const fallbackImg = 'https://placehold.co/400x300?text=No+Image';

  const [imgSrc, setImgSrc] = useState(fallbackImg);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [openPlanner, setOpenPlanner] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(recipe.image || fallbackImg);
  }, [recipe.image]);

  const handleAddToPlanner = () => {
    if (!date || !time) {
      toast.warn('Please select both date and time.');
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
    <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50">
      {/* Image Container with Overlay */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={recipe.title}
          fill
          style={{ objectFit: 'cover' }}
          className={`rounded-t-3xl transition-all duration-700 group-hover:scale-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={() => setImgSrc(fallbackImg)}
          onLoad={() => setIsImageLoaded(true)}
          unoptimized
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Dialog.Root open={openSummary} onOpenChange={setOpenSummary}>
            <Dialog.Trigger asChild>
              <button className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110 shadow-lg">
                <Info className="w-4 h-4" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
              <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-white">
                      Recipe Summary
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <div
                  className="prose dark:prose-invert text-sm max-h-[60vh] overflow-y-auto prose-headings:text-gray-800 dark:prose-headings:text-white"
                  dangerouslySetInnerHTML={{ __html: recipe.summary || 'No summary available.' }}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* Recipe Stats Badge */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
            <Clock className="w-3 h-3" />
            {recipe.readyInMinutes}m
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
            <Users className="w-3 h-3" />
            {recipe.servings}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
          {recipe.title}
        </h2>

        {/* Instructions Preview with Modal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Instructions</h3>
            </div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="text-xs text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors flex items-center gap-1">
                  <span>View Full</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
                        <ChefHat className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-gray-800 dark:text-white">
                          Cooking Instructions
                        </Dialog.Title>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Step by step guide for {recipe.title}
                        </p>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="overflow-y-auto max-h-[60vh] pr-2">
                    <div
                      className="prose dark:prose-invert prose-sm max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: recipe.instructions || '<p class="text-gray-500 italic">No instructions available for this recipe.</p>' }}
                    />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="relative">
            <div
              className="text-xs text-gray-600 dark:text-gray-400 max-h-16 overflow-hidden relative leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: recipe.instructions ? recipe.instructions.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : 'No instructions available.',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* All Ingredients with Collapsible View */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
              Ingredients ({recipe.extendedIngredients.length})
            </h3>
            {recipe.extendedIngredients.length > 6 && (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="text-xs text-green-500 hover:text-green-600 font-medium hover:underline transition-colors flex items-center gap-1">
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                  <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Dialog.Title className="text-2xl font-bold text-gray-800 dark:text-white">
                            All Ingredients
                          </Dialog.Title>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Complete shopping list for {recipe.title}
                          </p>
                        </div>
                      </div>
                      <Dialog.Close asChild>
                        <button className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </Dialog.Close>
                    </div>
                    <div className="overflow-y-auto max-h-[60vh] pr-2">
                      <div className="grid gap-3">
                        {recipe.extendedIngredients.map((ingredient, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {ingredient.original}
                              </p>
                              {ingredient.measures && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {ingredient.measures.metric?.amount} {ingredient.measures.metric?.unitShort}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            )}
          </div>
          <div className="space-y-1.5">
            {recipe.extendedIngredients.slice(0, 6).map((ingredient, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {ingredient.original}
                </span>
              </div>
            ))}
            {recipe.extendedIngredients.length > 6 && (
              <div className="text-xs text-orange-500 font-medium pl-4 py-1">
                +{recipe.extendedIngredients.length - 6} more ingredients...
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {(showAddToPlanner || onRemove) && (
          <div className="mt-auto pt-4 space-y-3">
            {showAddToPlanner && (
              <Dialog.Root open={openPlanner} onOpenChange={setOpenPlanner}>
                <Dialog.Trigger asChild>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add to Planner
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                  <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-white">
                          Schedule Meal
                        </Dialog.Title>
                      </div>
                      <Dialog.Close asChild>
                        <button className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </Dialog.Close>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition-all dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={e => setTime(e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition-all dark:text-white"
                        />
                      </div>
                      
                      <button
                        onClick={handleAddToPlanner}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
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
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Meal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}