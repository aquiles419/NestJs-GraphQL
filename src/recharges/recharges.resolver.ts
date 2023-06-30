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

  @Mutation(() => Recharge, { nullable: true })
  async deleteRecharge(@Args('id') id: string): Promise<Recharge | null> {
    return this.rechargeService.deleteRecharge(id);
  }

  @Mutation(() => Station)
  async recharge(@Args('input') input: RechargeInput): Promise<Station> {
    const { finishDateTime, stationId, userId } = input;
    // Verificar se o usuário já possui uma recarga em andamento
    // const userId = context.user.id; // Obter o ID do usuário autenticado (exemplo)
    const user = userId; // Obter o ID do usuário autenticado (exemplo)
    const existingRecharge =
      await this.rechargeService.getOngoingRechargeByUser(user);
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
