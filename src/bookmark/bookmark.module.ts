import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { DbService } from '../db/db.service';

@Module({
    controllers: [BookmarkController],
    providers: [BookmarkService, DbService],
})
export class BookmarkModule {}
