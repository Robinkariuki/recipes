// components/Recipes.tsx


export interface Recipe {
    id: number;
    title: string;
  }
  
  export default function Recipes({ recipes }: { recipes: Recipe[] }) {
    return (
      <div>
        <h1>Recipes</h1>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      </div>
    );
  }
  