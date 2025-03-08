import { createServer } from "node:http";
import fs from "fs";
import path from "path";
import { createYoga } from "graphql-yoga";
import { schema, processAgent } from "./graphql/index.js";

const yogaHandler = createYoga({ schema });

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    // Serve the static HTML file
    const htmlPath = path.join(process.cwd(), "public", "index.html");
    fs.readFile(htmlPath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Erro ao carregar o formulário");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.url === "/agent" && req.method?.toUpperCase() === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const query = payload.query;
        if (!query) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Query is required" }));
          return;
        }
        const result = await processAgent(query);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  } else {
    yogaHandler(req, res);
  }
});

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
