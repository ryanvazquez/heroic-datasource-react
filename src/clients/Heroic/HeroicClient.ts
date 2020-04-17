// external dependencies

// grafana dependencies
import { DataSourceInstanceSettings } from '@grafana/data';

// internal dependencies
import { DatasourceClient } from '../DatasourceClient';
import ROUTES from './routes';

export class HeroicClient extends DatasourceClient {

  constructor(settings: DataSourceInstanceSettings) {
    super(settings, ROUTES);
  }

  public status() {
    return this.datasourceRequest('/status');
  }

  public batchQuery(options?: any) {
    return this.datasourceRequest('/query/batch', options);
  }

}