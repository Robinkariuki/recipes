export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative path
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"; // dev fallback
}