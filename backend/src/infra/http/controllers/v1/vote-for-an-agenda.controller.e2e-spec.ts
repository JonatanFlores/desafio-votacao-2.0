import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('Vote for an agenda (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  test('[POST] /v1/vote', async () => {
    const agenda = await prisma.agenda.create({
      data: {
        description: 'New agenda',
        duration: 300,
      },
    });
    const response = await request(app.getHttpServer()).post('/v1/vote').send({
      cpf: '344.586.970-72',
      agendaId: agenda.id,
      choice: 'YES',
    });
    expect(response.statusCode).toBe(201);
    const voteOnDatabase = await prisma.vote.findFirst({
      where: { cpf: '344.586.970-72', agendaId: agenda.id },
    });
    expect(voteOnDatabase).toBeTruthy();
  });
});
