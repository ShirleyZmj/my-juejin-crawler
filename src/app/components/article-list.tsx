"use client";

import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { ISearchResult } from "../types/articles";

export default function ArticleList({
  articles,
  loading,
}: {
  articles: ISearchResult[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="mt-8 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="mt-8 text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">没有找到符合条件的文章</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-4">
        文章列表 ({articles.length})
      </h2>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={article.id || index}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h3 className="text-lg font-medium text-blue-600 hover:underline">
                {article.title}
              </h3>
              <p className="text-md text-gray-300">{article.briefContent}</p>

              <div className="mt-2 flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <HeartIcon className="h-4 w-4 mr-1 text-red-500" />
                  <span>{article.likes || 0} 喜欢</span>
                </div>

                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{article.views || 0} 浏览</span>
                </div>

                {article.score !== undefined && (
                  <div className="ml-auto">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      相关度: {(article.score * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
