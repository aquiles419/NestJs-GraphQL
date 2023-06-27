import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User } from './entities/user.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
  ): Promise<User> {
    return this.userService.createUser({ name, email });
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('email') email: string,
  ): Promise<User | null> {
    return this.userService.updateUser(id, { name, email });
  }

  @Mutation(() => User, { nullable: true })
  async deleteUser(@Args('id') id: string): Promise<User | null> {
    return this.userService.deleteUser(id);
  }
}
