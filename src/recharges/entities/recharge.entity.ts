import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Recharge {
  @Field(() => ID)
  id: string;

  @Field()
  startDateTime: Date;

  @Field()
  finishDateTime: Date;

  @Field()
  userId: string;

  @Field()
  stationId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
