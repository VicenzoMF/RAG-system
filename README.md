# RAG System Project

This project implements a Retrieval Augmented Generation (RAG) system that combines semantic search with AI-powered content generation to provide enriched, context-aware answers to user queries.

## Key Components and Tools Used

- **GraphQL-Yoga**: Provides a GraphQL API server (see [src/graphql/index.ts](src/graphql/index.ts)) for handling queries and mutations.
- **Qdrant Cloud**: A vector database that stores and retrieves content embeddings. It is managed using the [@qdrant/js-client-rest](https://www.npmjs.com/package/@qdrant/js-client-rest) client.
- **Google Generative AI**: Utilized for both generating embeddings ([src/graphql/embedding.ts](src/graphql/embedding.ts)) and generating responses via the Gemini Flash model.
- **Node.js with TypeScript**: The project is built using Node.js and TypeScript to ensure robustness and modern JavaScript capabilities.
- **Docker**: The project includes a Dockerfile and docker-compose.yml for containerized deployment.
- **CSV Data Ingestion**: Articles are ingested and cleaned through a pipeline that involves [src/graphql/dataInject.ts](src/graphql/dataInject.ts) and [src/graphql/articleCleaner.ts](src/graphql/articleCleaner.ts).

## Project Deployment

You can access the deployed project at:
[https://rag-system-production-2209.up.railway.app](https://rag-system-production-2209.up.railway.app)
