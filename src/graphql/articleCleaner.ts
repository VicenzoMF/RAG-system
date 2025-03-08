// filepath: /C:/Users/vicen/DevelopToday/src/graphql/articleCleaner.ts
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MAX_ATTEMPTS = 5;

function stripMarkdown(text: string): string {
  let trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    const lines = trimmed.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1].startsWith("```")) {
      lines.pop();
    }
    trimmed = lines.join("\n").trim();
  }
  return trimmed;
}

export async function cleanAndStructureArticle(
  rawContent: string,
  url: string,
  title: string = "",
  date: string = ""
): Promise<{ title: string; content: string; url: string; date: string }> {
  const prompt = `
You are an expert content cleaner. Please transform the following raw article content into a well-formed JSON object with the keys:
{
   "title": "Article Title",
   "content": "Cleaned article content...",
   "url": "https://…",
   "date": "YYYY-MM-DD"
}

Raw content: """${rawContent}"""
Fallback title: "${title}"
Fallback date: "${date}"
URL: "${url}"

If the title or date cannot be inferred from the content, use the provided fallbacks.
`;

  let attempts = 0;
  while (attempts < MAX_ATTEMPTS) {
    try {
      const response = await model.generateContent(prompt);
      // Aguarda a resolução do texto e remove a formatação Markdown, se houver
      const textResponseRaw = await response.response.text();
      console.log("LLM response:", textResponseRaw);
      const textResponse = stripMarkdown(textResponseRaw);
      const article = JSON.parse(textResponse);
      if (!article.url) {
        article.url = url;
      }
      return article;
    } catch (error: any) {
      if (error.message.includes("429")) {
        const delay = 2000 * (attempts + 1);
        console.warn(`Rate limited (attempt ${attempts + 1}). Retrying in ${delay} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempts++;
      } else {
        console.error("Error fetching LLM response:", error);
        break;
      }
    }
  }
  return { title, content: rawContent, url, date };
}
