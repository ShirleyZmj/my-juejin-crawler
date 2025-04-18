import { NextResponse } from 'next/server';
import { MilvusService } from '../../utils/milvus-service';
// import { MockMilvusService, Article } from '../../utils/mock-milvus-service';
import { formatErrorMessage, logServerError } from '../../utils/error-handler';
import { IArticle } from '@/app/types/articles';

// 定义文章接口
// interface Article {
//   id: string;
//   score?: number;
//   rank: number;
//   title: string;
//   url: string;
//   likes: number;
//   views: number;
// }

/**
 * GET处理函数 - 获取所有文章或搜索文章
 */
export async function GET(request: Request) {
  const milvusService = new MilvusService();
  // const milvusService = new MockMilvusService();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    let articles: IArticle[];

    if (query) {
      // 如果有查询参数，执行搜索
      articles = await milvusService.searchArticles(query);
      // 搜索结果已经在MilvusService中按相关度排序
    } else {
      // 否则获取所有文章
      articles = await milvusService.getAllArticles();
      // 无搜索时按排名排序
      articles.sort((a: IArticle, b: IArticle) => a.rank - b.rank);
    }

    console.log("搜索结果:", articles);

    // 直接返回文章数组
    return NextResponse.json(articles);
  } catch (error) {
    logServerError('API', error as Error);
    return NextResponse.json({
      error: formatErrorMessage(error as Error)
    }, { status: 500 });
  } finally {
    await milvusService.close();
  }
}