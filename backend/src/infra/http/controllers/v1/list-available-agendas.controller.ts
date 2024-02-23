import { Public } from '@/infra/auth/public';
import { AgendaData } from '@/application/data/agenda-data';

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
      }),
    ),
  }),
});

type ListAvailableAgendasOutput = z.infer<typeof outputSchema>;

@ApiTags('agenda')
@Controller('/v1/agenda')
export class ListAvailableAgendasController {
  constructor(private readonly agendaDataDatabase: AgendaData) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List available agendas' })
  @ApiResponse({
    status: 200,
    description: 'List with all available agendas for voting',
    schema: zodToOpenAPI(outputSchema),
  })
  async execute(): Promise<ListAvailableAgendasOutput> {
    const agendas = await this.agendaDataDatabase.getAgendas();
    return { data: { agendas } };
  }
}
