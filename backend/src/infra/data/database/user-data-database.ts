import { PrismaService } from '@/infra/database/prisma.service';
import { UserData } from '@/infra/data/interfaces/user-data';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDataDatabase implements UserData {
  constructor(private readonly prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<{
    id: string;
    cpf: string;
    name: string;
    password: string;
  } | null> {
    const user = await this.prisma.user.findUnique({ where: { cpf } });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      cpf: user.cpf,
      name: user.name,
      password: user.password,
    };
  }

  async create(input: { cpf: string; name: string; password: string }) {
    await this.prisma.user.create({
      data: {
        cpf: input.cpf,
        name: input.name,
        password: input.password,
      },
    });
  }
}
