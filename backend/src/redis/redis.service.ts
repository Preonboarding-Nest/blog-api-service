import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setKey(key: string, value: string, ttl: number): Promise<boolean> {
    try {
      await this.cacheManager.set(key, value, { ttl });
      return true;
    } catch (error) {
      throw new ForbiddenException('cache access failed!');
    }
  }

  async delKey(key: string): Promise<boolean> {
    try {
      await this.cacheManager.del(key);
      return true;
    } catch (error) {
      throw new ForbiddenException('cache access failed!');
    }
  }

  async getKey(key: string): Promise<string> {
    try {
      const value: string = (await this.cacheManager.get(key)) as string;
      return value;
    } catch (error) {
      throw new ForbiddenException('cache access failed!');
    }
  }
}
