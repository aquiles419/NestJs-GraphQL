import { Module } from '@nestjs/common';
import { PlanetsResolver } from './planets.resolver';
import { NasaApiService } from './nasaApi.service';

@Module({
  providers: [PlanetsResolver, NasaApiService],
})
export class PlanetsModule {}
