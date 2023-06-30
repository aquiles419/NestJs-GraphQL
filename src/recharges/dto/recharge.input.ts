import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RechargeInput {
  @Field()
  stationId: string;

  @Field()
  finishDateTime: Date;

  @Field()
  userId: string;
}
