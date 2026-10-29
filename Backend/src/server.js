import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { authRouter } from "./routes/authRoutes.js";
import { evaluationRouter } from "./routes/evaluationRoutes.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }), authRouter);
app.use("/api/evaluations", evaluationRouter);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  if (err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ message: `File is too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 10} MB.` });
  if (err.message?.startsWith("Unsupported file type")) return res.status(400).json({ message: err.message });
  if (err.name === "CastError") return res.status(404).json({ message: "Evaluation not found." });
  if (err.name === "ValidationError") return res.status(400).json({ message: Object.values(err.errors)[0].message });
  if (err.code === 11000) return res.status(409).json({ message: "That value is already in use." });
  console.error(err);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

mongoose.connect(env.mongoUri)
  .then(() => app.listen(env.port, () => console.log(`ProposalIQ API listening on port ${env.port}`)))
  .catch((error) => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
