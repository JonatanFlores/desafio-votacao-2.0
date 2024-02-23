import { Public } from '@/infra/auth/public';
import { VoteData } from '@/infra/data/interfaces/vote-data';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { isValidCPF } from '@/infra/validation/is-valid-cpf';

import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const inputSchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message:
      'CPF format is incorrect. Please double-check your entry for any mistakes',
  }),
  agendaId: z.string().uuid(),
  choice: z.enum(['YES', 'NO']),
});

type VoteForAnAgendaInput = z.infer<typeof inputSchema>;

@ApiTags('vote')
@Controller('/v1/vote')
export class VoteForAnAgendaController {
  constructor(private readonly voteData: VoteData) {}

  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe({ body: inputSchema }))
  @ApiOperation({ summary: 'Register a New Vote' })
  @ApiBody({ schema: zodToOpenAPI(inputSchema) })
  @ApiResponse({
    status: 201,
    description: 'Vote was registered successfully',
  })
  async execute(@Body() input: VoteForAnAgendaInput): Promise<void> {
    const { cpf, agendaId, choice } = input;
    const existingVote = await this.voteData.findUserVote({
      cpf,
      agendaId,
    });
    if (existingVote) {
      throw new ConflictException('You have already voted');
    }
    await this.voteData.create({ agendaId, cpf, choice });
  }
}
