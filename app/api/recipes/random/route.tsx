// app/api/recipes/random/route.ts (App Router format)
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tags = searchParams.get('tags') || '';
  const exclude = searchParams.get('exclude') || '';
  const includeNutrition = searchParams.get('includeNutrition') || 'false';
  const number = searchParams.get('number') || '10';

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?include-tags=${tags}&exclude-tags=${exclude}&includeNutrition=${includeNutrition}&number=${number}&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData.message || 'Failed to fetch' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ recipes: data.recipes });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
