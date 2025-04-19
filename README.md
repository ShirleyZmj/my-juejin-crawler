# Juejin Article Browser

English | [中文](./README_CN.md)

A Juejin article browser based on Next.js and Milvus vector database, supporting semantic search for quickly finding relevant Juejin articles.

## Project Overview

This project is a Juejin article search and browsing system that utilizes vector databases to store article information and semantic vectors, implementing semantic search through vector similarity search. Users can search for related articles using keywords and view article details and related information.

## Features

- Semantic search: Article search based on vector similarity, smarter than ordinary keyword search
- Article display: Show article title, likes, views, and other information
- Responsive design: Adapts to devices with various screen sizes
- Real-time updates: Real-time connection with Milvus database to ensure latest data

## Technology Stack

- **Frontend Framework**: Next.js 15.3.0 (App Router)
- **UI Components**: React 19, TailwindCSS 4, Headless UI
- **Vector Database**: Milvus 2.x
- **Vector Generation**: Text embedding models (OpenAI/local models optional)
- **Development Language**: TypeScript
- **HTTP Client**: Axios

## Requirements

- Node.js 18.x or higher
- Milvus 2.x database service
- Text embedding API (OpenAI API or local model API)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/my-juejin-crawler.git
cd my-juejin-crawler
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file to configure environment variables
```
NEXT_PUBLIC_AI_URL="https://api.openai.com/v1/embeddings"  # Or other API supporting text embedding
NEXT_PUBLIC_AI_API_KEY="your-api-key"
NEXT_PUBLIC_AI_MODEL="text-embedding-3-small"  # Or other supported models
```

4. Configure Milvus connection
Modify the Milvus connection parameters in the `src/app/utils/milvus-config.ts` file, including address, port, database name, and collection name.

Please refer to [juejin-crawl(feature/test-frontend)](https://github.com/ShirleyZmj/juejin-crawl/tree/feature/test-frontend): This is the upstream program of this project. It is responsible for creating database collections and storing data obtained by the crawler.

## Usage

1. Start the development server
```bash
npm run dev
```

2. Visit [http://localhost:3000](http://localhost:3000) in your browser

3. Enter keywords in the search box to search, or browse the displayed article list directly

4. Click on the article title to view the original URL

## System Flow

1. **Article Data Collection**: (Collect Juejin articles through a separate crawler program)
2. **Vector Generation**: Use text embedding models to convert article titles into vectors
3. **Data Storage**: Store article information and vectors in Milvus database
4. **User Search**: Frontend application receives user search keywords
5. **Vector Conversion**: Convert search keywords into vectors
6. **Similarity Search**: Search for similar article vectors in Milvus
7. **Result Display**: Sort and display search results to users by relevance

## Project Structure

```
my-juejin-crawler/
├── src/                        # Source code directory
│   ├── app/                    # Next.js App Router directory
│   │   ├── api/                # API routes
│   │   │   └── articles/       # Article API
│   │   ├── components/         # React components
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions and services
│   │   │   ├── milvus-service.ts  # Milvus service
│   │   │   ├── milvus-config.ts   # Milvus configuration
│   │   │   └── error-handler.ts   # Error handling
│   │   ├── page.tsx            # Main page
│   │   └── layout.tsx          # Layout component
│   └── ...
├── public/                     # Static resources
├── .env.local                  # Environment variables (not committed to repository)
├── next.config.ts              # Next.js configuration
└── package.json                # Project dependencies and scripts
```

## Milvus Database Design

### Collection: articles

| Field Name | Data Type | Description |
|--------|---------|------|
| id | VARCHAR | Unique article identifier |
| rank | INT64 | Article ranking |
| title | VARCHAR | Article title |
| url | VARCHAR | Article link |
| likes | INT64 | Number of likes |
| views | INT64 | Number of views |
| briefContent | VARCHAR | Article brief |
| title_vector | FLOAT_VECTOR(1024) | Vector representation of the title |

### Index

- **title_vector field**: Using FLAT/HNSW/IVF_FLAT index for vector search

## Notes

1. **API Key Security**: Ensure you don't commit API keys directly to the code repository, use environment variables for management
2. **Milvus Database**: Need to ensure Milvus service is running properly, automatic backup is recommended
3. **Vector Model Selection**: Different text embedding models can be chosen as needed, and domestic models can be used to replace OpenAI
4. **Data Collection**: Article data collection needs to comply with Juejin website's robots.txt rules and terms of use
5. **Performance Optimization**: With a large number of articles, consider adding Milvus partitions and optimizing index parameters

## Deployment

The project can be deployed on the Vercel platform or other platforms that support Next.js. Make sure to set the correct environment variables.

```bash
npm run build
npm run start
```
