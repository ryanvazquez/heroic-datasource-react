// external dependencies
import { merge } from 'lodash';

// grafana dependencies
import { BackendSrvRequest } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';

// internal dependencies
import { DatasourceClient } from '../DatasourceClient';
import { Tag, TagKeyCountRequest, TagKeyCountResponse, TagSuggestions } from './types';
import ROUTES from './routes';

/* 
  Need to do some clean up here with types.
  The metadata client just receives data from the datasource,
  appends any required or default fields to the payload and returns it.

  Except for template variable replacement, it performs no data transformation.
*/

export class MetadataClient extends DatasourceClient {

  // limits the amount of results returned by Heroic
  static KEY_SUGGEST_LIMIT = 100;
  static TAG_SUGGEST_LIMIT = 100;
  static TAG_KEYCOUNT_LIMIT = 100;
  static DEBOUNCE_MS = 0;

  constructor(settings: DataSourceInstanceSettings) {
    super(settings, ROUTES);
  };

  public keySuggest = (metadata: BackendSrvRequest) => {
    const opts = merge(
      { data: { ...metadata, limit: MetadataClient.KEY_SUGGEST_LIMIT }, },
      { debounce: MetadataClient.DEBOUNCE_MS },
    );
    return this.datasourceRequest(ROUTES['key-suggest'].url, opts);
  }

  public tagSuggest = (metadata: Tag): Promise<TagSuggestions[]> => {
    const opts = merge(
      { data: { ...metadata, limit: MetadataClient.TAG_SUGGEST_LIMIT }, },
      { debounce: MetadataClient.DEBOUNCE_MS },
    );
    return this.datasourceRequest(ROUTES['tag-suggest'].url, opts);
  }

  public tagKeyCount = (options?: TagKeyCountRequest): Promise<TagKeyCountResponse> => {
    if (options.filter[0] === "true") {
      options.limit = 50;
    }
    const opts = merge(
      { data: { ...options, limit: MetadataClient.TAG_KEYCOUNT_LIMIT } },
      { debounce: MetadataClient.DEBOUNCE_MS },
    );
    return this.datasourceRequest(ROUTES['tagkey-count'].url, opts);
  }

  public parseFilters = (metadata: BackendSrvRequest) => {
    const opts = merge(
      { data: metadata },
      { debounce: MetadataClient.DEBOUNCE_MS },
    );
    return this.datasourceRequest(ROUTES['parse-filter'].url, opts);
  }

}