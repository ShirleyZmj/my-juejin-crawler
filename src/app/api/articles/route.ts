import { NextResponse } from 'next/server';
import { MilvusService } from '../../utils/milvus-service';
import { formatErrorMessage, logServerError } from '../../utils/error-handler';

/**
 * GET处理函数 - 获取所有文章或搜索文章
 */
export async function GET(request: Request) {
  const milvusService = new MilvusService();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    let articles;

    if (query) {
      // 如果有查询参数，执行搜索
      articles = await milvusService.searchArticles(query);
      // 搜索结果已经在MilvusService中按相关度排序
    } else {
      // 否则获取所有文章
      articles = await milvusService.getAllArticles();
      // 无搜索时按排名排序
      articles.sort((a, b) => a.rank - b.rank);
    }

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