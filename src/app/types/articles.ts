export interface ISearchResult {
  id: string;
  score: number;
  rank: number;
  title: string;
  url: string;
  likes: number;
  views: number;
}

export interface IArticle {
  id: string;
  title: string;
  url: string;
  likes: number;
  views: number;
  rank: number;
}
