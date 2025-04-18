export interface ISearchResult {
  id: string;
  score: number;
  rank: number;
  title: string;
  url: string;
  likes: number;
  views: number;
  briefContent: string;
}

export interface IArticle {
  id: string;
  score?: number;
  rank: number;
  title: string;
  url: string;
  likes: number;
  views: number;
  briefContent: string;
}

