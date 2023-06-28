import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRechargeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
