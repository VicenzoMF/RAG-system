import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await model.embedContent(text);
    return result.embedding.values || Array(768).fill(0);
  } catch (error) {
    console.error("Error generating embedding:", error);
    return Array(768).fill(0);
  }
}

export { generateEmbedding };
