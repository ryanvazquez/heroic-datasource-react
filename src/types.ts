import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface HeroicQuery extends DataQuery {
  alias: string;
  globalAggregation: boolean;
  groupBy: any;
  orderByTime: string;
  query: string;
  resultFormat: string;
  select: any;
  resolution: string;
  tags: Tag[];
};

export interface Tag {
  key: string;
  operator: string;
  value: string;
  condition?: string;
  type?: string;
}

export const defaultQuery: Partial<HeroicQuery> = {
  // refId: string; supplied by Grafana
  // query: string; supplied by Grafana and parsed into obj.
  alias: '',  // [[some value]]
  globalAggregation: true,
  groupBy: [],
  // hide: boolean; ignore hide property
  orderByTime: 'ASC',
  resultFormat: 'time_series',
  select: [],
  resolution: '1m',
  tags: []
};

export interface HeroicOptions extends DataSourceJsonData {
  defaultUrl: string;
  showAccessOptions: boolean;
  alertingUrl?: string;
  tagCollapseChecks: any[];
  tagAggregationChecks: string[];
  suggestionRules: any[];
};

export enum TagOperators {
  MATCHES = '=',
  DOES_NOT_MATCH = '!=',
  PREFIXIED_WITH = '^',
  NOT_PREFIXED_WITH = '!^'
}