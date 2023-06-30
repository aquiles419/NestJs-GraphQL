import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRechargeInput {
  @Field()
  id: string;

  @Field()
  startDateTime: Date;

  @Field()
  finishDateTime: Date;

  @Field()
  userId: string;

  @Field()
  stationId: string;
}
