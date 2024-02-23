import { DatabaseModule } from '@/infra/database/database.module';
import { CreateAccountController } from '@/infra/http/controllers/v1/create-account.controller';
import { AuthenticateController } from '@/infra/http/controllers/v1/authenticate.controller';
import { RegisterNewAgendaController } from '@/infra/http/controllers/v1/register-new-agenda.controller';
import { ListAvailableAgendasController } from '@/infra/http/controllers/v1/list-available-agendas.controller';
import { VoteForAnAgendaController } from '@/infra/http/controllers/v1/vote-for-an-agenda.controller';
import { RegisterNewAgenda } from '@/application/use-cases/register-new-agenda';

import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    RegisterNewAgendaController,
    ListAvailableAgendasController,
    VoteForAnAgendaController,
  ],
  providers: [RegisterNewAgenda],
})
export class HttpModule {}
