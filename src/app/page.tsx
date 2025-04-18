"use client";

import { useState, useEffect } from "react";
import SearchBar from "./components/search-bar";
import ArticleList from "./components/article-list";
import { ISearchResult } from "./types/articles";
import { formatErrorMessage, logServerError } from "./utils/error-handler";

export default function Home() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<ISearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取文章的方法
  const fetchArticles = async (searchQuery = "") => {
    try {
      setLoading(true);
      console.log("开始获取文章, 查询:", searchQuery);

      // 构建API请求URL
      const url = searchQuery
        ? `/api/articles?query=${encodeURIComponent(searchQuery)}`
        : "/api/articles";

      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`获取文章失败: ${response.statusText}`);
      }

      const data = await response.json();

      // 确保articles是数组
      if (Array.isArray(data)) {
        setArticles(data);
      } else if (data.error) {
        // 如果返回了错误信息
        throw new Error(data.error);
      } else {
        // 如果返回了不期望的数据结构
        setArticles([]);
        throw new Error("服务器返回了不正确的数据格式");
      }

      setError(null);
    } catch (err) {
      logServerError("Home", err as Error);
      // console.error("获取文章出错:", err);
      setError(formatErrorMessage(err as Error));
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载时获取所有文章
  useEffect(() => {
    fetchArticles();
  }, []);

  // 处理搜索
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    await fetchArticles(searchQuery);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">掘金文章浏览器</h1>

        <SearchBar keyword={query} onSearch={handleSearch} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            错误: {error}
          </div>
        )}

        <ArticleList articles={articles} loading={loading} />
      </div>
    </main>
  );
}
