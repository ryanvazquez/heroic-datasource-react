import { DataQueryRequest, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { HeroicClient, MetadataClient } from './clients';
import { HeroicQuery } from './types';

/* 
  TODO: Bare bones application of a datasource. Enough to get up and running for UI development.
  NOOP for now until query editor component work is built out.
  
  Should try to port as much functionality from prev datasource as possible.
*/

export class HeroicDatasource extends DataSourceApi<HeroicQuery> {
  public heroic: HeroicClient;
  public metadata: MetadataClient;

  constructor(instanceSettings: DataSourceInstanceSettings) {
    super(instanceSettings);
    this.heroic = new HeroicClient(instanceSettings);
    this.metadata = new MetadataClient(instanceSettings);
  }

  // no try/catch block. Grafana will catch errors thrown by Datasource.query and update UI via "dogear" notification.
  query = async (options: DataQueryRequest<HeroicQuery>) => {
    return Promise.resolve({ data: [] });
  }

  testDatasource = async () => {
    try {
      const { data } = await this.heroic.status();
      if (data.ok) {
        return ({
          status: "success",
          message: `OK`,
          title: "Success",
        });
      }
      return ({
        status: "error",
        message: `FAILED: ${JSON.stringify(data)}`,
        title: "Failed"
      });
    } catch (error) {
      return ({
        status: "error",
        message: `FAILED: ${JSON.stringify(error)}`,
        title: "Failed"
      });
    }
  }
}