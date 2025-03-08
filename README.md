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

## Local Setup Instructions for the RAG System Project

1. Clone the Repository:

   - Download the project code to your local machine.

2. Install Dependencies:

   - Open a terminal in the project root directory.
   - Run: npm install
   - If you have problems with Typescript, run "npm install -g typescript"

3. Set Up Environment Variables:

   - Create a .env file in the root directory of the project.
   - Add the required environment variable keys. For example:

     QDRANT_URL=your_qdrant_url
     QDRANT_API_KEY=your_qdrant_api_key
     GEMINI_API_KEY=your_gemini_api_key

   - Replace "your_qdrant_url", "your_qdrant_api_key", and "your_gemini_api_key" with your own credentials.

4. Run the Application:

   - Start the application by running: npm start
   - The GraphQL API server should now be running locally.

5. Test the API:

   - You can test the GraphQL API using a tool like GraphQL Playground at http://localhost:4000 (default port may vary).

6. Optional - Using Docker:
   - If Docker is configured, you can build and run the container:
     a. Build the Docker image: docker build -t rag-system .
     b. Run the container: docker run --env-file .env -p 4000:4000 rag-system
