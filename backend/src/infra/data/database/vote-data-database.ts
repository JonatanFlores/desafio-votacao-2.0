import { PrismaService } from '@/infra/database/prisma.service';
import { VoteData } from '@/infra/data/interfaces/vote-data';

import { Injectable } from '@nestjs/common';
import { Choices } from '@prisma/client';

@Injectable()
export class VoteDataDatabase implements VoteData {
  constructor(private readonly prisma: PrismaService) {}

  async findUserVote(input: { cpf: string; agendaId: string }): Promise<{
    id: string;
    cpf: string;
    agendaId: string;
    choice: string;
  } | null> {
    const vote = await this.prisma.vote.findFirst({
      where: {
        cpf: input.cpf,
        agendaId: input.agendaId,
      },
    });
    if (!vote) {
      return null;
    }
    return {
      id: vote.id,
      cpf: vote.cpf,
      agendaId: vote.agendaId,
      choice: vote.choice.toString(),
    };
  }

  async create(input: { agendaId: string; cpf: string; choice: Choices }) {
    await this.prisma.vote.create({
      data: {
        agendaId: input.agendaId,
        cpf: input.cpf,
        choice: input.choice,
      },
    });
  }
}
