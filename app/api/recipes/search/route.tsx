// app/api/recipes/search/route.ts
import { NextResponse } from 'next/server';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    // Step 1: Search by keyword
    const searchUrl = new URL('https://api.spoonacular.com/recipes/complexSearch');
    searchUrl.searchParams.set('query', query);
    searchUrl.searchParams.set('number', '10');
    searchUrl.searchParams.set('apiKey', SPOONACULAR_API_KEY || '');

    const searchRes = await fetch(searchUrl.toString());
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return NextResponse.json(
        { error: searchData.message || 'Failed to search recipes' },
        { status: searchRes.status }
      );
    }

    const results = searchData.results;

    // Step 2: Fetch full details for each recipe
    const detailed = await Promise.all(
      results.map(async (recipe: any) => {
        const detailUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();

        if (!detailRes.ok) {
          throw new Error(`Failed to get info for recipe ID ${recipe.id}`);
        }

        return detailData;
      })
    );

    return NextResponse.json({ recipes: detailed }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error while fetching recipe details' },
      { status: 500 }
    );
  }
}
