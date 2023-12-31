import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRechargeInput {
  @Field()
  startDateTime: Date;

  @Field()
  finishDateTime: Date;

  @Field()
  userId: string;

  @Field()
  stationId: string;
}
