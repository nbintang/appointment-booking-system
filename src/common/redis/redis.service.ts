import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get<T>(key: string) {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number) {
    return this.cache.set(key, value, ttl ? ttl * 1000 : undefined); // 1000: 1 second
  }

  delete(key: string) {
    return this.cache.del(key);
  }
}
