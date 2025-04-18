"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({
  keyword,
  onSearch,
}: {
  keyword: string;
  onSearch: (searchQuery: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState(keyword || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
        <button
          type="submit"
          className="absolute right-2.5 bottom-1.5 bg-blue-500 text-white rounded-lg px-4 py-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          搜索
        </button>
      </form>
    </div>
  );
}
