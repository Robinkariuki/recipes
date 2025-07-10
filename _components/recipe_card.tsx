// components/RecipeCard.tsx

import Image from "next/image";
import { Recipe } from "./Recipes";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={recipe.image}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
        />
      </div>

      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
        <p className="text-gray-600 text-sm">{recipe.description}</p>

        <div className="flex flex-wrap gap-1 text-xs">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full"
            >
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
      </div>
    </div>
  );
}
