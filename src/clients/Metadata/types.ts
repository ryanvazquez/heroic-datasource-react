export interface Tag {
  key: string;
  value: string | null;
  filter: any[];
};

export interface TagSuggestions {
  score: number;
  key: string;
  value: string;
};

export interface TagKeyCountRequest {
  filter: any[];
}

export interface TagKeyCountResponse {
  errors: any[];
  suggestions: any[];
}