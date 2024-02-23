import { RegisterNewAgenda } from '@/application/use-cases/register-new-agenda';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const inputSchema = z.object({
  description: z
    .string()
    .min(2, { message: 'Description must contain at least 6 characters' }),
  duration: z.number().optional().default(60),
});

type RegisterNewAgendaInput = z.infer<typeof inputSchema>;

@ApiTags('agenda')
@ApiBearerAuth()
@Controller('/v1/agenda')
export class RegisterNewAgendaController {
  constructor(private readonly registerNewAgenda: RegisterNewAgenda) {}

  @Post()
  @UsePipes(new ZodValidationPipe({ body: inputSchema }))
  @ApiOperation({ summary: 'Register a New Agenda' })
  @ApiBody({ schema: zodToOpenAPI(inputSchema) })
  @ApiResponse({
    status: 201,
    description: 'Agenda was registered successfully',
  })
  async execute(@Body() input: RegisterNewAgendaInput): Promise<void> {
    const { description, duration } = input;
    await this.registerNewAgenda.execute({
      description,
      durationInSeconds: +duration,
    });
  }
}
