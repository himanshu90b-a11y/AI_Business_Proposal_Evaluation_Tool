import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Please log in to continue." });
  try {
    req.userId = jwt.verify(token, env.jwtSecret).userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}

export function setAuthCookie(res, userId) {
  const token = jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearAuthCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax"
  });
}
