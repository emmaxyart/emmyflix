import { ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Movie {
   
  adult: any;
  overview: ReactNode;
  backdrop_path: any;
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  // ... any other properties you need
}

export interface MovieResponse {
  results: Movie[];
  // ... any other properties from the API response
}


