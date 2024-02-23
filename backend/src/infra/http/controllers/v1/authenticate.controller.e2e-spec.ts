import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcryptjs';

describe('Authenticate (e2e)', () => {
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

  test('[POST] /v1/sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '344.586.970-72',
        password: await hash('s3Cur3P@ssw0rd', 8),
      },
    });
    const response = await request(app.getHttpServer())
      .post('/v1/sessions')
      .send({
        cpf: '344.586.970-72',
        password: 's3Cur3P@ssw0rd',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      data: { access_token: expect.any(String) },
    });
  });
});
