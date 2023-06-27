import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Planet {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  gravity: number;
}
