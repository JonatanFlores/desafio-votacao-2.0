import { AgendaData } from '../data/agenda-data';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterNewAgenda {
  constructor(private readonly agendaData: AgendaData) {}

  async execute(input: RegisterNewAgendaInput): Promise<void> {
    await this.agendaData.save({
      description: input.description,
      durationInSeconds: input.durationInSeconds,
    });
  }
}

export type RegisterNewAgendaInput = {
  description: string;
  durationInSeconds: number;
};
