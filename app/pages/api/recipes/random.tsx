// pages/api/recipes/random.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tags = '', exclude = '', includeNutrition = 'false', number = '10' } = req.query;

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?include-tags=${tags}&exclude-tags=${exclude}&includeNutrition=${includeNutrition}&number=${number}&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.message || 'Failed to fetch recipes' });
    }

    const data = await response.json();
    return res.status(200).json({ recipes: data.recipes }); // wrapped properly
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
