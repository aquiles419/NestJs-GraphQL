import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ListRechargeInput {
  @Field()
  id: string;
}
