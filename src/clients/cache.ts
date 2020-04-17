import _ from 'lodash';
import LRU, { Options } from 'lru-cache';

const defaults = {
  max: 10,
  maxAge: (1000 * 60 * 60)
};

export class Cache {
  constructor(public options: Options<string, any>) {
    this.lru = new LRU(_.defaults(options, defaults));
  }

  intercept = (request) => {
    let prevData = request.data;
    let key = request.data || '';
    let seen = false;
    if (this.lru.has(key)) {
      seen = true;
      prevData = this.lru.get(key);
    }
    return ({
      request,
      key,
      seen,
      prevData,
    });
  }

  update = (key, data) => {
    this.lru.set(key, JSON.stringify(data));
  }

}