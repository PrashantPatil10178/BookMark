import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, DbService],
})
export class AuthModule {}
