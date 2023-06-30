import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    const { name, email } = input;
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
    @Args('input') input: UpdateUserInput,
  ): Promise<User | null> {
    const { id, name, email } = input;
    return this.userService.updateUser(id, { name, email });
  }

  @Mutation(() => User, { nullable: true })
  async deleteUser(@Args('id') id: string): Promise<User | null> {
    return this.userService.deleteUser(id);
  }
}
