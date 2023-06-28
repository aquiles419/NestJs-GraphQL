import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Recharge } from './entities/recharge.entity';
import { RechargesService } from './recharges.service';
import { Station } from 'src/stations/entities/station.entity';

@Resolver()
export class RechargesResolver {
  constructor(private rechargeService: RechargesService) {}

  @Mutation(() => Recharge)
  async createRecharges(
    @Args('startDateTime') startDateTime: Date,
    @Args('finishDateTime') finishDateTime: Date,
    @Args('userId') userId: string,
    @Args('stationId') stationId: string,
  ): Promise<Recharge> {
    return this.rechargeService.createRecharges({
      startDateTime,
      finishDateTime,
      userId,
      stationId,
    });
  }

  @Query(() => [Recharge])
  async recharges(): Promise<Recharge[]> {
    return this.rechargeService.recharges();
  }

  @Query(() => Recharge, { nullable: true })
  async getRechargeById(@Args('id') id: string): Promise<Recharge | null> {
    return this.rechargeService.getRechargeById(id);
  }

  @Mutation(() => Recharge, { nullable: true })
  async updateRecharge(
    @Args('id') id: string,
    @Args('startDateTime') startDateTime: Date,
    @Args('finishDateTime') finishDateTime: Date,
    @Args('userId') userId: string,
    @Args('stationId') stationId: string,
  ): Promise<Recharge | null> {
    return this.rechargeService.updateRecharge(id, {
      startDateTime,
      finishDateTime,
      userId,
      stationId,
    });
  }

  @Mutation(() => Recharge, { nullable: true })
  async deleteStation(@Args('id') id: string): Promise<Recharge | null> {
    return this.rechargeService.deleteRecharge(id);
  }

  @Mutation(() => Station)
  async recharge(
    @Args('stationId') stationId: string,
    @Args('finishDateTime') finishDateTime: Date,
    @Args('userId') user: string,
    // @Context() context: any,
  ): Promise<Station> {
    // Verificar se o usuário já possui uma recarga em andamento
    // const userId = context.user.id; // Obter o ID do usuário autenticado (exemplo)
    const userId = user; // Obter o ID do usuário autenticado (exemplo)
    const existingRecharge =
      await this.rechargeService.getOngoingRechargeByUser(userId);
    if (existingRecharge) {
      throw new Error('User already has an ongoing recharge.');
    }

    // Realizar a recarga na estação
    const recharge = await this.rechargeService.recharge(
      stationId,
      finishDateTime,
      userId,
    );

    return recharge.station;
  }
}
