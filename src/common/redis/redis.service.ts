import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

class RedisKeyBuilder {
  private readonly segments: (string | number)[] = [];

  constructor(initialSegment: string | number) {
    this.segments.push(initialSegment);
  }

  add(segment: string | number): this {
    this.segments.push(segment);
    return this;
  }

  toString(): string {
    return this.segments.join(':');
  }
}

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  useKey(initialSegment: string | number): RedisKeyBuilder {
    return new RedisKeyBuilder(initialSegment);
  }

  get<T>(key: string | RedisKeyBuilder) {
    return this.cache.get<T>(key.toString());
  }

  set<T>(key: string | RedisKeyBuilder, value: T, ttl?: number) {
    return this.cache.set(key.toString(), value, ttl ? ttl * 1000 : undefined); // 1000: 1 second
  }

  delete(key: string | RedisKeyBuilder) {
    return this.cache.del(key.toString());
  }
}
