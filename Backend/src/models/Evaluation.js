import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
  { name: String, score: Number, note: String },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    filename: { type: String, required: true },
    proposalTitle: { type: String, required: true, trim: true, maxlength: 200 },
    score: { type: Number, required: true, min: 0, max: 100 },
    rating: { type: String, required: true },
    summary: { type: String, required: true },
    strengths: { type: [String], required: true },
    improvements: { type: [String], required: true },
    details: { type: [detailSchema], required: true }
  },
  { timestamps: true, versionKey: false }
);

evaluationSchema.index({ userId: 1, createdAt: -1 });

export const Evaluation = mongoose.model("Evaluation", evaluationSchema);
