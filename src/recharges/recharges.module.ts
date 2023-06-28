import { Module } from '@nestjs/common';
import { RechargesService } from './recharges.service';
import { RechargesResolver } from './recharges.resolver';
import { RechargeCronService } from 'src/utils/recharge-cron.service';

@Module({
  providers: [RechargesResolver, RechargesService, RechargeCronService],
})
export class RechargesModule {}
