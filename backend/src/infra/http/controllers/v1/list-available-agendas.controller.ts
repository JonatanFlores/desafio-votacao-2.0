import { Public } from '@/infra/auth/public';
import { AgendaData } from '@/infra/data/interfaces/agenda-data';

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const outputSchema = z.object({
  data: z.object({
    agendas: z.array(
      z.object({
        id: z.string(),
        description: z.string(),
        duration: z.number(),
        end_date: z.date(),
      }),
    ),
  }),
});

type ListAvailableAgendasOutput = z.infer<typeof outputSchema>;

@ApiTags('agenda')
@Controller('/v1/agenda')
export class ListAvailableAgendasController {
  constructor(private readonly agendaData: AgendaData) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List available agendas' })
  @ApiResponse({
    status: 200,
    description: 'List with all available agendas for voting',
    schema: zodToOpenAPI(outputSchema),
  })
  async execute(): Promise<ListAvailableAgendasOutput> {
    const agendas = await this.agendaData.getAgendas();
    const now = new Date();
    const output = agendas
      .filter((agenda) => agenda.endDate > now)
      .map((agenda) => ({
        id: agenda.id,
        description: agenda.description,
        duration: agenda.duration,
        end_date: agenda.endDate,
      }));
    return { data: { agendas: output } };
  }
}
