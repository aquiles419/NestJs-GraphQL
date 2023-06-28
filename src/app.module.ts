import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PlanetsModule } from './planets/planets.module';
import { UsersModule } from './users/users.module';
import { StationsModule } from './stations/stations.module';
import { RechargesModule } from './recharges/recharges.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    PlanetsModule,
    UsersModule,
    StationsModule,
    RechargesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
