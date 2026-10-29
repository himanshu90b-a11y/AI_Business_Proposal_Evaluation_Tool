import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { clearAuthCookie, setAuthCookie } from "../middleware/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  settings: user.settings
});

export async function register(req, res, next) {
  try {
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!fullName || !emailPattern.test(email || "") || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Enter a name and valid email, and use a password with at least 8 characters." });
    }
    if (await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
    const user = await User.create({ fullName, email, passwordHash: await bcrypt.hash(password, 12) });
    setAuthCookie(res, user._id.toString());
    return res.status(201).json({ user: userResponse(user) });
  } catch (error) { return next(error); }
}

export async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    setAuthCookie(res, user._id.toString());
    return res.json({ user: userResponse(user) });
  } catch (error) { return next(error); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: "User no longer exists." });
    return res.json({ user: userResponse(user) });
  } catch (error) { return next(error); }
}

export async function updateSettings(req, res, next) {
  try {
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const theme = req.body.theme;
    if (!fullName || !emailPattern.test(email || "") || !["light", "dark"].includes(theme)) {
      return res.status(400).json({ message: "Enter a name, valid email, and valid theme." });
    }
    const existing = await User.findOne({ email, _id: { $ne: req.userId } });
    if (existing) return res.status(409).json({ message: "That email address is already in use." });
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName, email, settings: { emailNotifications: Boolean(req.body.emailNotifications), theme } },
      { new: true, runValidators: true }
    );
    return res.json({ user: userResponse(user) });
  } catch (error) { return next(error); }
}

export function logout(_req, res) {
  clearAuthCookie(res);
  return res.status(204).end();
}
