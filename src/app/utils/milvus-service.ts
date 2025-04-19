import { ConsistencyLevelEnum, MilvusClient } from '@zilliz/milvus2-sdk-node';
import { milvusConfig } from './milvus-config';
import axios from 'axios';
import { ISearchResult } from '../types/articles';
import { logServerError } from './error-handler';

/**
 * 文本转向量函数
 * @param {string} text - 需要转换为向量的文本
 * @returns {Promise<Array<number>>} - 返回向量数组
 */
export async function textToVector(text: string) {
  const response = await axios.post(milvusConfig.embedding.url, {
    model: milvusConfig.embedding.model,
    input: text,
    encoding_format: 'float'
  }, {
    headers: {
      'Authorization': `Bearer ${milvusConfig.embedding.apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.data[0].embedding;
}

/**
 * Milvus服务类 - 处理与Milvus的所有交互
 */
export class MilvusService {
  private client: MilvusClient | null = null;
  private isConnected = false;

  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * 连接到Milvus数据库
   */
  async connect() {
    if (this.isConnected) return;

    try {
      this.client = new MilvusClient({
        address: `${milvusConfig.milvus.address}:${milvusConfig.milvus.port}`,
        username: '',
        password: '',
        // ssl: false,
        // protoFilePath: {
        //   milvus: 'milvus.proto',
        //   schema: 'schema.proto'
        // },
        // loadProto: true,
        // useIdentity: false 
      });
      console.log('connect to milvus');

      await this.client.use({
        db_name: milvusConfig.milvus.database
      });
      console.log('use database', milvusConfig.milvus.database);

      // 检查集合是否存在
      const hasCollection = await this.client.hasCollection({
        collection_name: milvusConfig.milvus.collection
      });
      console.log('has collection', milvusConfig.milvus.collection);

      if (!hasCollection.value) {
        throw new Error(`集合 ${milvusConfig.milvus.collection} 不存在`);
      }

      // 加载集合，确保可以搜索
      await this.client.loadCollection({
        collection_name: milvusConfig.milvus.collection
      });
      console.log('load collection', milvusConfig.milvus.collection);

      this.isConnected = true;
    } catch (error) {
      logServerError("连接Milvus失败", error as Error);
      throw new Error('无法连接到Milvus数据库');
    }
  }

  /**
   * 搜索文章, 向量搜索，返回相似的文章
   * @param {string} searchTerm - 搜索关键词
   * @param {number} limit - 结果数量限制
   * @returns {Promise<Array>} - 搜索结果
   */
  async searchArticles(searchTerm: string, limit = 10) {
    await this.connect();

    try {
      if (!this.client) {
        throw new Error('未连接到Milvus数据库');
      }

      // 将搜索词转换为向量
      const searchVector = await textToVector(searchTerm);

      // console.log(searchTerm, "搜索向量:", searchVector);

      // 搜索相似向量
      const searchResults = await this.client.search({
        collection_name: milvusConfig.milvus.collection,
        data: [{
          anns_field: 'title_vector',
          data: searchVector,
        }],
        output_fields: [
          "id",
          "rank",
          "title",
          "url",
          "likes",
          "views",
          "briefContent"
        ],
        limit: limit,
        filter: "",
        consistency_level: ConsistencyLevelEnum.Bounded
      });

      // console.log('searchResults', searchResults);

      // 处理搜索结果
      let processedResults: ISearchResult[] = [];

      if (searchResults.results && Array.isArray(searchResults.results)) {
        processedResults = searchResults.results.map(result => {
          return {
            id: result.id || '',
            score: typeof result.score === 'number' ? result.score : 0,
            rank: result.rank || 0,
            title: result.title || '',
            url: result.url || '',
            likes: result.likes || 0,
            views: result.views || 0,
            briefContent: result.briefContent || ''
          };
        });
      }

      return processedResults;
    } catch (error) {
      console.error('搜索文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有文章
   * @param {number} limit - 结果数量限制
   * @returns {Promise<Array>} - 文章列表
   */
  async getAllArticles(limit = 100) {
    await this.connect();

    try {
      if (!this.client) {
        throw new Error('未连接到Milvus数据库');
      }

      // 标量搜索
      const result = await this.client.query({
        collection_name: milvusConfig.milvus.collection,
        output_fields: ['rank', 'title', 'url', 'likes', 'views'],
        limit: limit
      });

      console.log("获取所有文章结果:", result);

      if (!result.data) {
        return [];
      }

      return result.data.map(item => ({
        id: item.id || '',
        rank: item.rank || 0,
        title: item.title || '',
        url: item.url || '',
        likes: item.likes || 0,
        views: item.views || 0,
        briefContent: item.briefContent || ''
      }));
    } catch (error) {
      console.error('获取所有文章失败:', error);
      throw error;
    }
  }

  /**
   * 关闭Milvus连接
   */
  async close() {
    if (this.client) {
      try {
        // Milvus SDK没有显式的close方法，但我们可以将client设为null
        this.client = null;
        this.isConnected = false;
      } catch (error) {
        console.error('关闭Milvus连接失败:', error);
      }
    }
  }
}

