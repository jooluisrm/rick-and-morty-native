export interface LocationDetail {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface LocationResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: LocationDetail[];
}

export interface LocationFilter {
  name?: string;
  type?: string;
  dimension?: string;
}

