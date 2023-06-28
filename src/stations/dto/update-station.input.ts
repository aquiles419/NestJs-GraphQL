import { CreateStationInput } from './create-station.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStationInput extends PartialType(CreateStationInput) {
  @Field(() => Int)
  id: number;
}
