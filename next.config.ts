import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['node_modules/@zilliz/milvus2-sdk-node/dist/proto/**/*'],
  },
  serverExternalPackages: ['@zilliz/milvus2-sdk-node'],
};

export default nextConfig;
