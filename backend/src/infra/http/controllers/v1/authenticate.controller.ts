import { Public } from '@/infra/auth/public';
import { isValidCPF } from '@/infra/validation/is-valid-cpf';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { UserData } from '@/infra/data/interfaces/user-data';

import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { compare } from 'bcryptjs';

const inputSchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message:
      'CPF format is incorrect. Please double-check your entry for any mistakes',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' }),
});

const outputSchema = z.object({
  data: z.object({
    access_token: z.string(),
  }),
});

type AuthenticateInput = z.infer<typeof inputSchema>;
type AuthenticateOutput = z.infer<typeof outputSchema>;

@ApiTags('account')
@Controller('/v1/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private userData: UserData,
  ) {}

  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe({ body: inputSchema }))
  @ApiOperation({ summary: 'Authenticate an user into the application' })
  @ApiBody({ schema: zodToOpenAPI(inputSchema) })
  @ApiResponse({
    status: 201,
    description: 'An user authenticated successfully',
    schema: zodToOpenAPI(outputSchema),
  })
  @ApiResponse({
    status: 401,
    description: 'User credentials do not match',
  })
  async execute(@Body() input: AuthenticateInput): Promise<AuthenticateOutput> {
    const { cpf, password } = input;
    const user = await this.userData.findByCpf(cpf);
    if (!user) {
      throw new UnauthorizedException('User credentials do not match');
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match');
    }
    const accessToken = this.jwt.sign({ sub: user.id });
    return {
      data: {
        access_token: accessToken,
      },
    };
  }
}
