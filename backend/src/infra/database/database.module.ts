import { PrismaService } from '@/infra/database/prisma.service';
import { AgendaData } from '@/application/data/agenda-data';
import { AgendaDataDatabase } from '@/infra/data/database/agenda-data-database';

import { Module } from '@nestjs/common';

@Module({
  providers: [
    PrismaService,
    {
      provide: AgendaData,
      useClass: AgendaDataDatabase,
    },
  ],
  exports: [PrismaService, AgendaData],
})
export class DatabaseModule {}
