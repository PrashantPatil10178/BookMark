import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtStrategy } from '../auth/strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from '../db/db.service';

@Module({
    imports: [PassportModule],
    controllers: [UserController],
    providers: [JwtStrategy, DbService],
})
export class UserModule {}
