import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { BookmarkDto, EditBookmark } from './DTO';

@Injectable()
export class BookmarkService {
    constructor(private Prisma: DbService) {}

    async createBookmark(userId: number, Dto: BookmarkDto) {
        const bookmark = await this.Prisma.bookmark.create({
            data: {
                userId,
                ...Dto,
            },
        });
        return {
            bookmark,
            message: 'BookMark Created Sucessfully',
        };
    }
    async getBookmarks(userId: number) {
        const user = await this.Prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                bookmarks: true,
            },
        });
        return user;
    }
    async getBookmarkById(BookmardId: number) {
        const bookmark = await this.Prisma.bookmark.findUnique({
            where: {
                id: BookmardId,
            },
        });

        return bookmark;
    }
    async editBookmark(userId: number, BookmarkId: number, Dto: EditBookmark) {
        const bookmark = await this.Prisma.bookmark.findUnique({
            where: {
                id: BookmarkId,
                userId,
            },
        });

        if (!bookmark || bookmark.userId != userId) {
            throw new ForbiddenException('Access to this resourse Denied');
        }
        const updatedBookmark = await this.Prisma.bookmark.update({
            where: {
                id: BookmarkId,
                userId,
            },
            data: {
                ...Dto,
            },
        });

        return { updatedBookmark, message: 'Your Bookmark has been Updated' };
    }
    async deleteBookmark(userId: number, BookmarkId: number) {
        const bookmark = await this.Prisma.bookmark.findUnique({
            where: {
                id: BookmarkId,
                userId,
            },
        });

        if (!bookmark || bookmark.userId != userId) {
            throw new ForbiddenException('Access to this resourse Denied');
        }

        const deletedBookmark = await this.Prisma.bookmark.delete({
            where: {
                id: BookmarkId,
                userId,
            },
        });

        return {
            deletedBookmark,
            message: 'You Bookmark has been Deleted 👍',
        };
    }
}
