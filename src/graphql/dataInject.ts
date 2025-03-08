import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
import axios from "axios";
import csv from "csv-parser";
import fs from "fs";
import * as cheerio from "cheerio";
import { generateEmbedding } from "./embedding.js";
import { cleanAndStructureArticle } from "./articleCleaner.js";

dotenv.config();

const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const QDRANT_URL = process.env.QDRANT_URL || "http://qdrant:6333";
const COLLECTION_NAME = "myCollection";
const qdrant = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY, checkCompatibility: false });

async function extractContent(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Ajuste conforme necessário para extrair o conteúdo real do artigo
    const content = $("article").text() || $("main").text() || $("body").text();
    return content.slice(0, 1000); // Limitando o conteúdo extraído
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return "";
  }
}

async function ingestCSV(filePath: string) {
  const articles: any[] = [];

  const stream = fs.createReadStream(filePath).pipe(csv());

  for await (const row of stream) {
    if (!row.URL) {
      console.error("Missing URL in CSV row:", row);
      continue;
    }
    const rawContent = await extractContent(row.URL);
    if (!rawContent) continue;

    const cleanedArticle = await cleanAndStructureArticle(rawContent, row.URL, row.title, row.date);
    const embedding = await generateEmbedding(cleanedArticle.content);

    articles.push({
      title: cleanedArticle.title,
      content: cleanedArticle.content,
      url: cleanedArticle.url,
      date: cleanedArticle.date,
      vector: embedding,
    });
  }

  console.log(articles.length, "articles extracted and cleaned.");
  for (const article of articles) {
    await qdrant.upsert(COLLECTION_NAME, {
      points: [{ id: Date.now(), vector: article.vector, payload: article }],
    });
    console.log("Ingestion completed for:", article.title);
  }
}

(async () => {
  await ingestCSV("articles_dataset.csv");
})();
