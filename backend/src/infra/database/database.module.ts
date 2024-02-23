import { PrismaService } from '@/infra/database/prisma.service';
import { AgendaData } from '@/infra/data/interfaces/agenda-data';
import { AgendaDataDatabase } from '@/infra/data/database/agenda-data-database';
import { UserData } from '@/infra/data/interfaces/user-data';
import { UserDataDatabase } from '@/infra/data/database/user-data-database';
import { VoteData } from '@/infra/data/interfaces/vote-data';
import { VoteDataDatabase } from '@/infra/data/database/vote-data-database';

import { Module } from '@nestjs/common';

@Module({
  providers: [
    PrismaService,
    {
      provide: AgendaData,
      useClass: AgendaDataDatabase,
    },
    {
      provide: UserData,
      useClass: UserDataDatabase,
    },
    {
      provide: VoteData,
      useClass: VoteDataDatabase,
    },
  ],
  exports: [PrismaService, AgendaData, UserData, VoteData],
})
export class DatabaseModule {}
