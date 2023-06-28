import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StationsService } from './stations.service';
import { Station } from './entities/station.entity';

@Resolver()
export class StationsResolver {
  constructor(private stationService: StationsService) {}

  @Mutation(() => Station)
  async installStation(
    @Args('planetName') planetName: string,
    @Args('hasStation') hasStation: boolean,
  ): Promise<Station> {
    return this.stationService.installStation({ planetName, hasStation });
  }

  @Query(() => [Station])
  async stations(): Promise<Station[]> {
    return this.stationService.stations();
  }

  @Query(() => Station, { nullable: true })
  async getStationById(@Args('id') id: string): Promise<Station | null> {
    return this.stationService.getStationById(id);
  }

  @Mutation(() => Station, { nullable: true })
  async updateStation(
    @Args('id') id: string,
    @Args('planetName') planetName: string,
    @Args('hasStation') hasStation: boolean,
  ): Promise<Station | null> {
    return this.stationService.updateStation(id, { planetName, hasStation });
  }

  @Mutation(() => Station, { nullable: true })
  async deleteStation(@Args('id') id: string): Promise<Station | null> {
    return this.stationService.deleteStation(id);
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
    const existingRecharge = await this.stationService.getOngoingRechargeByUser(
      userId,
    );
    if (existingRecharge) {
      throw new Error('User already has an ongoing recharge.');
    }

    // Realizar a recarga na estação
    const recharge = await this.stationService.recharge(
      stationId,
      finishDateTime,
      userId,
    );

    return recharge.station;
  }
}
