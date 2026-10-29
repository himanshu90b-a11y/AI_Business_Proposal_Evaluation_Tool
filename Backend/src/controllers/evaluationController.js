import { Evaluation } from "../models/Evaluation.js";
import mongoose from "mongoose";
import { extractText } from "../utils/extractText.js";
import { evaluateProposal } from "../utils/evaluateProposal.js";

export async function createEvaluation(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "Please choose a TXT, PDF, or DOCX file." });
    const proposalTitle = req.body.title?.trim() || "Untitled Proposal";
    const text = await extractText(req.file);
    if (!text.trim()) return res.status(400).json({ message: "Could not read text from this file. Try a text-based PDF or DOCX, or upload a TXT file." });
    const evaluation = await Evaluation.create({
      userId: req.userId,
      filename: req.file.originalname,
      proposalTitle,
      ...evaluateProposal(text)
    });
    return res.status(201).json({ evaluation });
  } catch (error) { return next(error); }
}

export async function listEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ evaluations });
  } catch (error) { return next(error); }
}

export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findOne({ _id: req.params.id, userId: req.userId });
    if (!evaluation) return res.status(404).json({ message: "Evaluation not found or you do not have permission to view it." });
    return res.json({ evaluation });
  } catch (error) { return next(error); }
}

export async function dashboard(req, res, next) {
  try {
    const [recent, stats] = await Promise.all([
      Evaluation.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(5),
      Evaluation.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
        { $group: { _id: null, count: { $sum: 1 }, average: { $avg: "$score" } } }
      ])
    ]);
    const summary = stats[0] || { count: 0, average: 0 };
    return res.json({ recent, count: summary.count, average: Math.round(summary.average || 0) });
  } catch (error) { return next(error); }
}
