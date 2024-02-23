import { DatabaseModule } from '@/infra/database/database.module';
import { CreateAccountController } from '@/infra/http/controllers/v1/create-account.controller';
import { AuthenticateController } from '@/infra/http/controllers/v1/authenticate.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
  ],
  providers: [RegisterNewAgenda],
})
export class HttpModule {}
