# 掘金文章浏览器

[English](./README.md) | 中文

一个基于Next.js和Milvus向量数据库开发的掘金文章浏览器，支持语义搜索功能，可以快速找到相关的掘金文章。

## 项目简介

该项目是一个掘金文章搜索和浏览系统，利用向量数据库存储文章信息和语义向量，通过向量相似度搜索实现语义搜索功能。用户可以通过关键词搜索相关文章，并查看文章详情和相关信息。

## 功能特点

- 语义搜索：基于向量相似度的文章搜索，比普通关键词搜索更智能
- 文章展示：展示文章标题、点赞数、浏览量等信息
- 响应式设计：适配各种屏幕尺寸的设备
- 实时更新：与Milvus数据库实时连接，保证数据最新

## 技术栈

- **前端框架**：Next.js 15.3.0 (App Router)
- **UI组件**：React 19, TailwindCSS 4, Headless UI
- **向量数据库**：Milvus 2.x
- **向量生成**：文本嵌入模型 (OpenAI/国产模型可选)
- **开发语言**：TypeScript
- **HTTP客户端**：Axios

## 环境要求

- Node.js 18.x 或更高版本
- Milvus 2.x 数据库服务
- 文本嵌入API (OpenAI API或国产模型API)

## 安装步骤

1. 克隆项目仓库
```bash
git clone https://github.com/yourusername/my-juejin-crawler.git
cd my-juejin-crawler
```

2. 安装依赖
```bash
npm install
```

3. 创建`.env.local`文件配置环境变量
```
NEXT_PUBLIC_AI_URL="https://api.openai.com/v1/embeddings"  # 或其他支持文本嵌入的API
NEXT_PUBLIC_AI_API_KEY="your-api-key"
NEXT_PUBLIC_AI_MODEL="text-embedding-3-small"  # 或其他支持的模型
```

4. 配置Milvus连接
修改`src/app/utils/milvus-config.ts`文件中的Milvus连接参数，包括地址、端口、数据库名和集合名。

此处请参考[juejin-crawl(feature/test-frontend)](https://github.com/ShirleyZmj/juejin-crawl/tree/feature/test-frontend)：这是本项目的上游程序。负责建立数据库集合，存放爬虫得到的数据。

## 使用方法

1. 启动开发服务器
```bash
npm run dev
```

2. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

3. 在搜索框中输入关键词进行搜索，或直接浏览展示的文章列表

4. 点击文章标题可查看原文地址

## 系统流程

1. **文章数据采集**：（通过单独的爬虫程序采集掘金文章）
2. **向量生成**：使用文本嵌入模型将文章标题转换为向量
3. **数据存储**：将文章信息和向量存储到Milvus数据库
4. **用户搜索**：前端应用接收用户搜索关键词
5. **向量转换**：将搜索关键词转换为向量
6. **相似度搜索**：在Milvus中搜索相似的文章向量
7. **结果展示**：将搜索结果按相关度排序展示给用户

## 项目结构

```
my-juejin-crawler/
├── src/                        # 源代码目录
│   ├── app/                    # Next.js App Router目录
│   │   ├── api/                # API路由
│   │   │   └── articles/       # 文章API
│   │   ├── components/         # React组件
│   │   ├── types/              # TypeScript类型定义
│   │   ├── utils/              # 工具函数和服务
│   │   │   ├── milvus-service.ts  # Milvus服务
│   │   │   ├── milvus-config.ts   # Milvus配置
│   │   │   └── error-handler.ts   # 错误处理
│   │   ├── page.tsx            # 主页
│   │   └── layout.tsx          # 布局组件
│   └── ...
├── public/                     # 静态资源
├── .env.local                  # 环境变量(不提交到仓库)
├── next.config.ts              # Next.js配置
└── package.json                # 项目依赖和脚本
```

## Milvus数据库设计

### 集合: articles

| 字段名 | 数据类型 | 描述 |
|--------|---------|------|
| id | VARCHAR | 文章唯一标识符 |
| rank | INT64 | 文章排名 |
| title | VARCHAR | 文章标题 |
| url | VARCHAR | 文章链接 |
| likes | INT64 | 点赞数 |
| views | INT64 | 浏览量 |
| briefContent | VARCHAR | 文章简介 |
| title_vector | FLOAT_VECTOR(1024) | 标题的向量表示 |

### 索引

- **title_vector字段**：使用FLAT/HNSW/IVF_FLAT索引进行向量搜索

## 注意事项

1. **API密钥安全**：确保不要将API密钥直接提交到代码仓库，使用环境变量管理
2. **Milvus数据库**：需要保证Milvus服务正常运行，建议设置自动备份
3. **向量模型选择**：可以根据需要选择不同的文本嵌入模型，也可使用国产模型代替OpenAI
4. **数据采集**：文章数据采集需要遵守掘金网站的robots.txt规则和使用条款
5. **性能优化**：大量文章时，可以考虑增加Milvus分区和优化索引参数

## 部署

项目可以部署在Vercel平台，或其他支持Next.js的平台上。确保设置正确的环境变量。

```bash
npm run build
npm run start
``` 