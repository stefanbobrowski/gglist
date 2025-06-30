import rateLimit from "express-rate-limit";

// ✅ Shared rate limit handler
const logRateLimitHit = (req: any, res: any, _next: any, options: any) => {
  console.warn(`⚠️ Rate limit hit by IP ${req.ip} on ${req.originalUrl}`);
  res.status(options.statusCode).json({ error: options.message });
};

// 🔐 Login limiter (high risk, lower window)
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: logRateLimitHit,
});

// ⭐️ Favorites limiter (medium risk, short window)
export const favoritesRateLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  message: "Too many favorite requests. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: logRateLimitHit,
});

// 🧠 Top cards limiter (light rate)
export const topRateLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 5,
  message: "Too many requests for top cards. Please wait.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: logRateLimitHit,
});
