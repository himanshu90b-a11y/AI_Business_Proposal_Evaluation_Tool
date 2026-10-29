import mammoth from "mammoth";
import pdf from "pdf-parse";

export async function extractText(file) {
  const extension = file.originalname.split(".").pop()?.toLowerCase();
  if (extension === "txt") return file.buffer.toString("utf8");
  if (extension === "pdf") return (await pdf(file.buffer)).text;
  if (extension === "docx") return (await mammoth.extractRawText({ buffer: file.buffer })).value;
  return "";
}
