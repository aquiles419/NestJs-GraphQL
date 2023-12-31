import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Recharge } from './entities/recharge.entity';
import { RechargesService } from './recharges.service';
import { Station } from 'src/stations/entities/station.entity';
import { ListRechargeInput } from './dto/list-recharge.input';
import { UpdateRechargeInput } from './dto/update-recharge.input';
import { RechargeInput } from './dto/recharge.input';

@Resolver()
export class RechargesResolver {
  constructor(private rechargeService: RechargesService) {}

  @Query(() => [Recharge])
  async recharges(): Promise<Recharge[]> {
    return this.rechargeService.recharges();
  }

  @Query(() => Recharge, { nullable: true })
  async getRechargeById(
    @Args('input') input: ListRechargeInput,
  ): Promise<Recharge | null> {
    const { id } = input;
    return this.rechargeService.getRechargeById(id);
  }

  @Mutation(() => Recharge, { nullable: true })
  async updateRecharge(
    @Args('input') input: UpdateRechargeInput,
  ): Promise<Recharge | null> {
    const { id, startDateTime, finishDateTime, userId, stationId } = input;
    return this.rechargeService.updateRecharge(id, {
      startDateTime,
      finishDateTime,
      userId,
      stationId,
    });
  }

  @Mutation(() => Station)
  async recharge(@Args('input') input: RechargeInput): Promise<Station> {
    const { finishDateTime, stationId, userId } = input;
    const user = userId;
    const existingRecharge =
      await this.rechargeService.getOngoingRechargeByUser(user);
    if (existingRecharge) {
      throw new Error('User already has an ongoing recharge.');
    }

    const recharge = await this.rechargeService.recharge(
      stationId,
      finishDateTime,
      userId,
    );

    return recharge.station;
  }
}
