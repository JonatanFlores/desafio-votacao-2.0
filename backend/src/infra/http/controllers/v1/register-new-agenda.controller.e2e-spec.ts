import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

describe('Register a new agenda (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[POST] /v1/agenda', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '344.586.970-72',
        password: 's3Cur3P@ssw0rd',
      },
    });
    const accessToken = jwt.sign({ sub: user.id });
    const response = await request(app.getHttpServer())
      .post('/v1/agenda')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'New agenda about SOLID',
        duration: 180,
      });
    expect(response.statusCode).toBe(201);
    const agendaOnDatabase = await prisma.agenda.findFirst({
      where: { description: 'New agenda about SOLID' },
    });
    expect(agendaOnDatabase).toBeTruthy();
  });
});
