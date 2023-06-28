import { CreateRechargeInput } from './create-recharge.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRechargeInput extends PartialType(CreateRechargeInput) {
  @Field(() => Int)
  id: number;
}
