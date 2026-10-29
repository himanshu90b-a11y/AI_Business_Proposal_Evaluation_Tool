const criteria = {
  "Problem clarity": ["problem", "challenge", "need", "solution"],
  "Market potential": ["market", "customer", "target audience", "competitor", "industry"],
  "Financial planning": ["cost", "revenue", "profit", "budget", "investment", "financial"],
  Feasibility: ["timeline", "team", "resource", "implementation", "operation"],
  "Risk planning": ["risk", "limitation", "mitigation", "assumption"],
  Innovation: ["innovative", "innovation", "unique", "different", "technology"]
};

// This intentionally mirrors the original transparent, keyword-based prototype scoring.
export function evaluateProposal(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();
  const wordCount = (cleaned.match(/\b[\w'-]+\b/g) || []).length;
  const details = [];
  let points = 0;

  for (const [name, keywords] of Object.entries(criteria)) {
    const hits = keywords.filter((keyword) => lower.includes(keyword)).length;
    const score = Math.min(10, Math.round((hits / Math.min(3, keywords.length)) * 10));
    points += score;
    details.push({ name, score, note: score >= 7 ? "Good coverage" : "Add more specific detail" });
  }

  const lengthPoints = wordCount >= 500 ? 10 : wordCount >= 250 ? 7 : wordCount >= 100 ? 4 : 1;
  points += lengthPoints;
  const score = Math.round((points / 70) * 100);
  const rating = score >= 75 ? "Strong starting point" : score >= 50 ? "Needs refinement" : "Early draft";
  const strengths = details.filter((detail) => detail.score >= 7).map((detail) => detail.name);
  const improvements = details.filter((detail) => detail.score < 7).map((detail) => detail.name);

  if (wordCount >= 250) strengths.push("Proposal has a useful amount of detail");
  else improvements.push("Add more detail and supporting evidence");

  return {
    score,
    rating,
    details,
    strengths: strengths.length ? strengths : ["A proposal has been submitted for review"],
    improvements: improvements.length ? improvements : ["Add evidence, assumptions, and measurable targets"],
    summary: `The document contains approximately ${wordCount} words. This preliminary review scored ${score}/100 based on keyword coverage and document length.`
  };
}
