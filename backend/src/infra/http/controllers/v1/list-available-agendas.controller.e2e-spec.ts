import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('List available agendas (e2e)', () => {
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
    await prisma.agenda.createMany({
      data: [
        {
          description: 'New agenda 01',
          duration: 180,
        },
        {
          description: 'New agenda 02',
          duration: 300,
        },
      ],
    });
    const response = await request(app.getHttpServer())
      .get('/v1/agenda')
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      data: {
        agendas: [
          {
            id: expect.any(String),
            description: 'New agenda 01',
            duration: 180,
          },
          {
            id: expect.any(String),
            description: 'New agenda 02',
            duration: 300,
          },
        ],
      },
    });
  });
});
