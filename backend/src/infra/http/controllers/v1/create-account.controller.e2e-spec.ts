import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma.service';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('Create account (e2e)', () => {
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

  test('[POST] /v1/account', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/account')
      .send({
        name: 'John Doe',
        cpf: '344.586.970-72',
        password: 's3Cur3P@ssw0rd',
      });
    expect(response.statusCode).toBe(201);
    const userOnDatabase = await prisma.user.findUnique({
      where: { cpf: '344.586.970-72' },
    });
    expect(userOnDatabase).toBeTruthy();
  });
});
