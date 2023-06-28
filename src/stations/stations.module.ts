import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsResolver } from './stations.resolver';

@Module({
  providers: [StationsResolver, StationsService],
})
export class StationsModule {}
