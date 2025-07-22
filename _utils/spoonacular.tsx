import axios from "axios";

const spoonacular = axios.create({
  baseURL: "https://api.spoonacular.com",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    apiKey: process.env.SPOONACULAR_API_KEY,
  },
});

export default spoonacular;
