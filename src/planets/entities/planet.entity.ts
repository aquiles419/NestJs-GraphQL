import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Planet {
  @Field(() => ID)
  name: string;

  @Field()
  mass: string;

  @Field()
  hasStation: string;
}
