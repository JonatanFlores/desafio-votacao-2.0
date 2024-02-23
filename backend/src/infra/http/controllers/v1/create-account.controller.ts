import { Public } from '@/infra/auth/public';
import { PrismaService } from '@/infra/database/prisma.service';
import { isValidCPF } from '@/infra/validation/is-valid-cpf';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

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
import { hash } from 'bcryptjs';

const inputSchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message:
      'CPF format is incorrect. Please double-check your entry for any mistakes',
  }),
  name: z
    .string()
    .min(2, { message: 'Name must contain at least 2 characters' })
    .max(30, { message: 'Name must contain at most 30 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' }),
});

type CreateAccountInput = z.infer<typeof inputSchema>;

@ApiTags('account')
@Controller('/v1/account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe({ body: inputSchema }))
  @ApiOperation({ summary: 'Register a New User' })
  @ApiBody({ schema: zodToOpenAPI(inputSchema) })
  @ApiResponse({
    status: 201,
    description: 'An user was registered successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'An user with the same CPF already existis.',
  })
  async execute(@Body() input: CreateAccountInput): Promise<void> {
    const { cpf, name, password } = input;
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { cpf },
    });
    if (userWithSameEmail) {
      throw new ConflictException('An user with the same CPF already existis.');
    }
    const hashedPassword = await hash(password, 8);
    await this.prisma.user.create({
      data: {
        cpf,
        name,
        password: hashedPassword,
      },
    });
  }
}
