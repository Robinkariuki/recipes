// pages/api/recipes/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
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
      return res.status(searchRes.status).json({ error: searchData.message || 'Failed to search recipes' });
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

    return res.status(200).json({ recipes: detailed });
  } catch (error) {
    return res.status(500).json({ error: 'Server error while fetching recipe details' });
  }
}
