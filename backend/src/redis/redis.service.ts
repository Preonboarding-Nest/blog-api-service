import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setKey(key: string, value: string, ttl: number): Promise<boolean> {
    try {
      await this.cacheManager.set(key, value, { ttl });
      return true;
    } catch (error) {}
  }
}
