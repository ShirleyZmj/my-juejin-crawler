export const milvusConfig = {
  milvus: {
    address: '192.168.31.166',
    port: '19530',
    // database: 'default',
    // collection: 'juejin_articles',\\
    database: 'juejin',
    collection: 'articles',
    username: '',
    password: '',
    vectorDimension: 1024
  },
  embedding: {
    url: process.env.AI_URL || 'your-api-url',
    model: 'text-embedding-3-small',
    apiKey: process.env.AI_API_KEY || 'your-api-key'  // 实际部署时应使用环境变量
  }
};