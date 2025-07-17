export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser uses relative
  return process.env.BASE_URL || "http://localhost:3000";
}
