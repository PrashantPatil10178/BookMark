import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BookmarkController } from './bookmark/bookmark.controller';
import { BookmarkService } from './bookmark/bookmark.service';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        DbModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({}),
        BookmarkModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
