import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<User | null> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.prisma.user.delete({ where: { id } });
  }
}
