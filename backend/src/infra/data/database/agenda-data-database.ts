import { PrismaService } from '@/infra/database/prisma.service';
import { AgendaData } from '@/application/data/agenda-data';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AgendaDataDatabase implements AgendaData {
  constructor(private readonly prisma: PrismaService) {}

  async save(input: {
    description: string;
    durationInSeconds: number;
  }): Promise<void> {
    await this.prisma.agenda.create({
      data: {
        description: input.description,
        duration: input.durationInSeconds,
      },
    });
  }

  async getAgendas(): Promise<
    Array<{
      id: string;
      description: string;
      duration: number;
    }>
  > {
    const agendas = await this.prisma.agenda.findMany({
      select: { id: true, description: true, duration: true },
    });
    return agendas;
  }
}
