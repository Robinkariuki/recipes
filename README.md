# 🥘 MealMate

**MealMate** is a modern meal discovery and planning web application built using the [Next.js App Router](https://nextjs.org/docs/app), [TypeScript](https://www.typescriptlang.org/), and [React Query](https://tanstack.com/query). It allows users to search for recipes or explore random meals in a clean and responsive interface.

Powered by the [Spoonacular API](https://spoonacular.com/food-api), MealMate helps you discover meals based on your preferences.

---

## ✨ Features

- 🔍 **Search Recipes** – Find meals by keyword with detailed nutritional and ingredient info.
- 🎲 **Random Recipes** – Browse a variety of randomly selected meals.
- 💾 **Debounced Input** – Smooth UX when typing search terms.
- 🚀 **Server API Routes** – Protects API key via Next.js backend.
- ⚡ **React Query** – Handles data fetching, caching, and revalidation.
- 💅 **Tailwind CSS** – Fully responsive and mobile-first design.
- 💡 **Context API** – Shares global search state between components.

---

## 🧱 Tech Stack

| Tech         | Purpose                            |
|--------------|------------------------------------|
| **Next.js**  | App Router, Routing, API routes    |
| **TypeScript** | Type safety & DX                  |
| **React Query** | Data fetching and caching        |
| **Tailwind CSS** | Styling and responsive design  |
| **Spoonacular API** | Meal data & search results |
| **Vercel**   | Deployment and hosting             |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Robinkariuki/recipes.git
cd recipes
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create a `.env.local` File

Create a `.env.local` file at the root of the project:

```env
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

You can get a free API key from: [https://spoonacular.com/food-api](https://spoonacular.com/food-api)

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open your browser and visit: [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure (Highlights)

```
app/
  ├── page.tsx                 # Main home/recipes page
  └── api/
      └── recipes/
          ├── search/route.ts # API route to search meals
          └── random/route.ts # API route for random meals

components/
  └── recipe_card.tsx          # Reusable recipe display component

hooks/
  ├── useSearchRecipes.ts      # Hook for fetching search results
  ├── useRandomRecipes.ts      # Hook for fetching random recipes
  └── useDebounce.ts           # Custom hook for input debouncing

contexts/
  └── MealPlannerContext.tsx   # Global search term context

_utils/
  ├── types/types.ts           # Type definitions (e.g., Recipe)
  └── spoonacular.ts           # (Optional) Axios instance
```

---

## 🔐 API Integration Notes

All Spoonacular API calls are routed through your own server-side handlers under `app/api` to keep your API key secure.

Example endpoints:

```
GET /api/recipes/search?query=chicken
GET /api/recipes/random?number=8
```

These internally call the Spoonacular API using your secret key stored in `.env.local`.

---

## 🌐 Deployment

This project is fully optimized for deployment on [Vercel](https://vercel.com/):

### Steps to Deploy:

1. Push the code to GitHub.
2. Go to [vercel.com](https://vercel.com/) and import your GitHub repo.
3. In the **Project Settings**, add the following environment variable:

```env
SPOONACULAR_API_KEY=your_spoonacular_api_key
```

4. Click **Deploy**.

---

## 🧪 Developer Notes

- You can modify `app/page.tsx` to change the UI logic.
- API routes use the **App Router** syntax: `app/api/.../route.ts`.
- Styling is handled with **Tailwind**, which is configured for mobile-first design.
- React Query is used to fetch, cache, and update data without boilerplate.

---

## 🖼️ UI Preview

_Add a screenshot here:_

```
[MealMate Preview](./assets/preview.png)
```

---

## 📄 License

This project is open-source and licensed under the MIT License.

MIT © [Robin Kariuki](https://github.com/Robinkariuki)

---

## 🙌 Acknowledgments

- [Spoonacular](https://spoonacular.com/food-api) for their awesome recipe data.
- [Next.js](https://nextjs.org)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)