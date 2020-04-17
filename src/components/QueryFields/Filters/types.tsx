export interface Filter {
  key: string;
  operator: string;
  value: string;
};

export interface FilterProps {
  label: string;
  filters: Array<Filter>;
  onChange: (value: Filter) => void;
};