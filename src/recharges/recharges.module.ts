import { Module } from '@nestjs/common';
import { RechargesService } from './recharges.service';
import { RechargesResolver } from './recharges.resolver';

@Module({
  providers: [RechargesResolver, RechargesService],
})
export class RechargesModule {}
