import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkDto, EditBookmark } from './DTO';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
    constructor(private BookmarkService: BookmarkService) {}

    @Post('createBookmark')
    createBookmark(@GetUser('id') userId: number, @Body() Dto: BookmarkDto) {
        return this.BookmarkService.createBookmark(userId, Dto);
    }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.BookmarkService.getBookmarks(userId);
    }

    @Get(':id ')
    getBookmarkById(@Param('id', ParseIntPipe) BookmarkId: number) {
        return this.BookmarkService.getBookmarkById(BookmarkId);
    }

    @Patch(':id')
    editBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) BookmarkId: number,
        @Body() Dto: EditBookmark,
    ) {
        return this.BookmarkService.editBookmark(userId, BookmarkId, Dto);
    }

    @Delete(':id')
    deleteBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) BookmarkId: number,
    ) {
        return this.BookmarkService.deleteBookmark(userId, BookmarkId);
    }
}
