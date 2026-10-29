import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { createEvaluation, dashboard, getEvaluation, listEvaluations } from "../controllers/evaluationController.js";
import { requireAuth } from "../middleware/auth.js";

const acceptedExtensions = new Set(["txt", "pdf", "docx"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSizeBytes, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = file.originalname.split(".").pop()?.toLowerCase();
    callback(extension && acceptedExtensions.has(extension) ? null : new Error("Unsupported file type. Please upload TXT, PDF, or DOCX."), true);
  }
});

export const evaluationRouter = Router();
evaluationRouter.use(requireAuth);
evaluationRouter.get("/dashboard", dashboard);
evaluationRouter.get("/", listEvaluations);
evaluationRouter.get("/:id", getEvaluation);
evaluationRouter.post("/", upload.single("proposal"), createEvaluation);
