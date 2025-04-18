import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";
import { milvusConfig } from "./milvus-config";
import { logServerError } from "./error-handler";
import { IArticle } from "../types/articles";

export class MilvusDB {
  private client: MilvusClient;
  private database: string;
  private collection: string;
  private dimension: number;

  constructor() {
    this.client = new MilvusClient({
      address: `${milvusConfig.milvus.address}:${milvusConfig.milvus.port}`,
      username: milvusConfig.milvus.username,
      password: milvusConfig.milvus.password,
    });
    this.database = milvusConfig.milvus.database;
    this.collection = milvusConfig.milvus.collection;
    this.dimension = milvusConfig.milvus.vectorDimension;
  }

  async init() {
    await this.createDatabase();
    await this.useDatabase();
  }

  async useDatabase() {
    try {
      await this.client.use({ db_name: this.database });
    } catch (error) {
      logServerError("使用数据库失败", error as Error);
      throw error;
    }
  }

  /**
   * to create a database
   */
  async createDatabase() {
    try {
      await this.client.createDatabase({
        db_name: this.database,
      });
    } catch (error) {
      if ((error as Error).message.includes("already exists")) {
        return;
      }
      logServerError("创建数据库失败", error as Error);
      throw error;
    }
  }

  /**
   * to check if the collection exists
   * @returns boolean
   */
  async hasCollection() {
    const response = await this.client.hasCollection({
      collection_name: this.collection,
    });
    return response.value === true;
  }

  /**
   * to create a collection
   */
  async createCollection() {
    const fields = [
      {
        name: "id",
        data_type: DataType.Int64,
        is_primary_key: true,
        autoID: true,
      },
      {
        name: "rank",
        data_type: DataType.Int64,
        description: "文章排名",
      },
      {
        name: "title",
        data_type: DataType.VarChar,
        max_length: 512,
        description: "文章标题",
      },
      {
        name: "title_vector",
        data_type: DataType.FloatVector,
        dim: this.dimension,
        description: "标题向量",
      },
      {
        name: "url",
        data_type: DataType.VarChar,
        max_length: 512,
        description: "文章链接",
      },
      {
        name: "likes",
        data_type: DataType.Int64,
        description: "点赞数",
      },
      {
        name: "views",
        data_type: DataType.Int64,
        description: "阅读量",
      },
    ];

    await this.client.createCollection({
      collection_name: this.collection,
      fields,
    });

    await this.client.createIndex({
      collection_name: this.collection,
      field_name: "title_vector",
      index_type: "HNSW", // HNSW 是基于图的索引类型
      metric_type: "COSINE", // COSINE 是余弦相似度
      params: {
        // 索引参数
        M: 8, // 每个节点的邻居数
        efConstruction: 64, // 构建索引时考虑的邻居数
      },
    });

    // 加载集合, 确保索引构建完成, 从磁盘加载到内存
    await this.client.loadCollection({
      collection_name: this.collection,
    });
  }

  /**
   * to insert data into the collection
   * @param {Array} data
   */
  async insertData(data: IArticle[]) {
    if (!data || !data.length) {
      return;
    }

    const processedData = data.map((item) => {
      return {
        rank: item.rank,
        title: item.title,
        // title_vector: item.title_vector,
        url: item.url,
        likes: item.likes,
        views: item.views,
      };
    });

    const insertData = {
      collection_name: this.collection,
      fields_data: processedData,
    };

    await this.client.insert(insertData);
  }

  /**
   * to drop a collection
   */
  async dropCollection() {
    const exists = await this.hasCollection();

    if (!exists) {
      return;
    }

    await this.client.dropCollection({
      collection_name: this.collection,
    });
  }

  /**
   * to close the connection
   */
  async close() {
    if (!this.client) {
      return;
    }
    await this.client.closeConnection();
  }
}
