// external dependencies
import { defaultsDeep } from 'lodash';

// grafana dependencies
import { getBackendSrv, BackendSrvRequest } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';

import { Cache } from './cache';

export interface DataSourceResult {
  lastRequest: any;
  error: Error | null;
  data: any[];
}

export class DatasourceClient {
  public settings: DataSourceInstanceSettings;
  public routes: any;

  public static ROOT = '/';
  public static INSPECT = { type: "heroic" };
  public static HEADERS = {
    "Content-Type": "application/json;charset=UTF-8",
  };

  constructor(settings: DataSourceInstanceSettings, routes: any) {
    this.settings = settings;
    this.routes = {};
    for (const route in routes) {
      this.register(routes[route]);
    }
  };

  /* 
    Each route gets its own cache
  */

  register = ({ url, method, headers, ...options }) => {
    this.routes[url] = {
      options: {
        url: this.settings.url + url,
        method,
        headers: headers || DatasourceClient.HEADERS,
        inspect: DatasourceClient.INSPECT,
      },
      cache: new Cache(options)
    };
  }

  /* 
    TODO: Set up caching for metadata only. Currently EVERY req to the datasource is cached. Probably don't want to do that for large
    queries that could contain huge MB responses. 
  */

  async datasourceRequest(url: string, options?: BackendSrvRequest): Promise<DataSourceResult> {
    if (!this.routes[url]) {
      throw { message: `Could not find ${url} in cache.` }
    }

    const { options: defaults, cache } = this.routes[url];
    const req = defaultsDeep({}, defaults, options);

    // TODO: Janky check. Improve this. 
    if (req.method === 'POST' && req.headers['Content-Type'] === DatasourceClient.HEADERS['Content-Type']) {
      req.data = JSON.stringify(req.data);
    }

    const { request, key, seen, prevData } = cache.intercept(req);

    try {
      if (seen) {
        return Promise.resolve({
          lastRequest: request,
          error: null,
          data: JSON.parse(prevData)
        });
      }
      // TODO: Trying to avoid passing the ds instance around but should make sure getBackendSrv() can reliably return it.
      const { data } = await getBackendSrv().datasourceRequest(request);
      cache.update(key, data);

      return Promise.resolve({
        lastRequest: request,
        error: null,
        data
      });

    } catch (error) {
      return Promise.reject({
        lastRequest: request,
        error,
        data: null
      });
    }
  }
}