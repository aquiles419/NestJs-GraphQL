import { ObjectType, Field } from '@nestjs/graphql';
import { User as PrismaUser } from '.prisma/client';

@ObjectType()
export class User implements PrismaUser {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
