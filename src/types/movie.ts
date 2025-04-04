import { ReactNode } from "react";

export interface Movie {
  key: any;
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface MovieResponse {
  release_date: string | number | Date;
  vote_average: any;
  overview: ReactNode;
  backdrop_path: any;
  title: string;
  results: Movie[];
  page: number;
  total_pages: number;
}
