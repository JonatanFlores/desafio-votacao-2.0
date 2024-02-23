import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { AgendaData } from '@/application/data/agenda-data';

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const inputSchema = z.object({
  agendaId: z.string().uuid(),
});

const outputSchema = z.object({
  data: z.object({
    agenda: z.object({
      id: z.string(),
      description: z.string(),
      duration: z.number(),
      passed: z.boolean().default(false),
    }),
    vote: z.object({
      count: z.number(),
    }),
    session: z.object({
      active: z.boolean().default(false),
    }),
  }),
});

type ShowAgendaDetailsInput = z.infer<typeof inputSchema>;
type ShowAgendaDetailsOutput = z.infer<typeof outputSchema>;

@ApiTags('agenda')
@Controller('/v1/agenda')
export class ShowAgendaDetailsController {
  constructor(private readonly agendaData: AgendaData) {}

  @Get('/:agendaId')
  @Public()
  @UsePipes(new ZodValidationPipe({ param: inputSchema }))
  @ApiOperation({ summary: 'Show details of an agenda' })
  @ApiParam({ name: 'agendaId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Details of a given agenda',
    schema: zodToOpenAPI(outputSchema),
  })
  async execute(
    @Param() input: ShowAgendaDetailsInput,
  ): Promise<ShowAgendaDetailsOutput> {
    const { agendaId } = input;
    const details = await this.agendaData.getDetails({ agendaId });
    if (!details) {
      throw new NotFoundException('Agenda was not found');
    }
    const currentDate = new Date();
    const endDate = details.agenda.endDate;
    const sessionEnded = endDate.getTime() > currentDate.getTime();
    return {
      data: {
        agenda: {
          id: details.agenda.id,
          description: details.agenda.description,
          duration: details.agenda.duration,
          passed: details.agenda.passed,
        },
        vote: {
          count: details.votes.totalCount,
        },
        session: {
          active: sessionEnded,
        },
      },
    };
  }
}
