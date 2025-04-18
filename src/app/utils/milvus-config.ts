export const milvusConfig = {
  milvus: {
    address: '192.168.31.166',
    port: '19530',
    // database: 'default',
    // collection: 'juejin_articles',\\
    database: 'myJuejin',
    collection: 'articles',
    username: '',
    password: '',
    vectorDimension: 1024
  },
  embedding: {
    url: process.env.NEXT_PUBLIC_AI_URL || 'your-api-url',
    model: process.env.NEXT_PUBLIC_AI_MODEL || 'text-embedding-3-small',
    apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || 'your-api-key'  // 实际部署时应使用环境变量
  }
};