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
}
