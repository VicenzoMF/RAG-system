import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config.js";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});

async function createCollection() {
  try {
    await client.deleteCollection("myCollection");
    await client.createCollection("myCollection", {
      vectors: { size: 768, distance: "Cosine" },
    });
    console.log("Collection created.");
  } catch (error) {
    console.error("Error creating collection:", error);
  }
}

createCollection();
