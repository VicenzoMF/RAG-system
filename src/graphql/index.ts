import { createSchema } from "graphql-yoga";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
import { generateEmbedding } from "./embedding.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("QDRANT_URL:", QDRANT_URL);
console.log("QDRANT_API_KEY:", QDRANT_API_KEY);
console.log("GEMINI_API_KEY:", GEMINI_API_KEY);

const qdrant = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY, checkCompatibility: false });
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function processAgent(query: string): Promise<{
  answer: string;
  sources: { title: string; url: string; date: string }[];
}> {
  // Gera embedding para a query
  const queryEmbedding = await generateEmbedding(query);

  // Busca informações relevantes no Qdrant
  const searchResults = await qdrant.search("myCollection", {
    vector: queryEmbedding,
    limit: 5,
  });

  console.log("Search Results:", JSON.stringify(searchResults, null, 2));

  const context = searchResults
    .map((item: any) => item.payload?.content)
    .filter((content: any) => content !== undefined)
    .join("\n");

  // Chama o Gemini API para gerar a resposta
  const geminiResponse = await model.generateContent(`${context}\n\n${query}`);
  const answerText = geminiResponse.response.text();
  console.log(answerText);

  return {
    answer: answerText,
    sources: searchResults.map((item: any) => ({
      title: item.payload?.title,
      url: item.payload?.url,
      date: item.payload?.date,
    })),
  };
}

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String
      health: String
    }
    type Mutation {
      agent(query: String!): AgentResponse
    }
    type AgentResponse {
      answer: String
      sources: [Source]
    }
    type Source {
      title: String
      url: String
      date: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "world",
      health: () => "RAG API is running",
    },
    Mutation: {
      agent: async (_: any, args: { query: string }) => {
        if (!args.query) {
          throw new Error("Query is required");
        }
        return await processAgent(args.query);
      },
    },
  },
});
