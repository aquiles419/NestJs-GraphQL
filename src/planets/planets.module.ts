import { Module } from '@nestjs/common';
import { PlanetsResolver } from './planets.resolver';
import { NasaApiService } from './nasaApi.service';
import { RedisCacheService } from 'src/utils/redis-cache.service';

@Module({
  providers: [PlanetsResolver, NasaApiService, RedisCacheService],
})
export class PlanetsModule {}
