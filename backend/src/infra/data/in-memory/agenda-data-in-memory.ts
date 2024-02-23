import { AgendaData } from '@/application/data/agenda-data';

import { randomUUID } from 'crypto';

export class AgendaDataInMemory implements AgendaData {
  private items: Array<{
    id: string;
    description: string;
    duration: number;
  }> = [];

  async save(input: {
    description: string;
    durationInSeconds: number;
  }): Promise<void> {
    this.items.push({
      id: randomUUID(),
      description: input.description,
      duration: input.durationInSeconds,
    });
  }

  async getAgendas(): Promise<
    Array<{
      id: string;
      description: string;
      duration: number;
    }>
  > {
    return this.items;
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
    throw new Error('Method not implemented.');
  }
}
