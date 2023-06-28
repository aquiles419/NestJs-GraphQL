import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Station {
  @Field(() => ID)
  id: string;

  @Field()
  planetName: string;

  @Field()
  hasStation: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
