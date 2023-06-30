// redis-cache.service.ts

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import redisConfig from './redis.config';

@Injectable()
export class RedisCacheService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(redisConfig);
  }

  async get(key: string): Promise<any> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
