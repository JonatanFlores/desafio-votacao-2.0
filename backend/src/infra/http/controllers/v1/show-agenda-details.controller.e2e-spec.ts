import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('Show agenda details (e2e)', () => {
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

  test('[GET] /v1/agenda', async () => {
    const agenda = await prisma.agenda.create({
      data: {
        description: 'New agenda 01',
        duration: 10800,
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/v1/agenda/${agenda.id}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      data: {
        agenda: {
          id: agenda.id,
          description: 'New agenda 01',
          duration: 10800,
          passed: false,
        },
        vote: {
          count: 0,
        },
        session: {
          active: true,
        },
      },
    });
  });
});
