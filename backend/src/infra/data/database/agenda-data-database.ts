import { PrismaService } from '@/infra/database/prisma.service';
import { AgendaData } from '@/infra/data/interfaces/agenda-data';

import { Injectable } from '@nestjs/common';

function addMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

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
      endDate: Date;
    }>
  > {
    const agendas = await this.prisma.agenda.findMany({
      select: { id: true, description: true, duration: true, createdAt: true },
    });
    return agendas.map((agenda) => {
      const durationInMinutes = agenda.duration / 60;
      const endDate = addMinutesToDate(agenda.createdAt, durationInMinutes);
      return {
        ...agenda,
        endDate,
      };
    });
  }

  async getDetails(input: { agendaId: string }): Promise<{
    agenda: {
      id: string;
      description: string;
      duration: number;
      passed: boolean;
      endDate: Date;
    };
    votes: { YES: number; NO: number; totalCount: number };
  } | null> {
    const { agendaId } = input;
    const agenda = await this.prisma.agenda.findFirst({
      where: { id: agendaId },
    });
    if (!agenda) {
      return null;
    }
    const votes = await this.prisma.vote.groupBy({
      by: ['choice'],
      _count: { choice: true },
    });
    const result = votes.reduce(
      (previous, current) => {
        const type = current.choice;
        const total = current._count.choice;
        previous[type] = total;
        return previous;
      },
      { YES: 0, NO: 0 },
    );
    const totalCount = result.YES + result.NO;
    const agendaPassed = result.YES > result.NO;
    const durationInMinutes = agenda.duration / 60;
    const endDate = addMinutesToDate(agenda.createdAt, durationInMinutes);
    return {
      agenda: {
        id: agenda.id,
        description: agenda.description,
        duration: agenda.duration,
        passed: agendaPassed,
        endDate,
      },
      votes: {
        YES: result.YES,
        NO: result.NO,
        totalCount,
      },
    };
  }
}
