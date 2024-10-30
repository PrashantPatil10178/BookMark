import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
@Global()
export class DbService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://cr7:cr7@localhost:5432/cr7?schema=public',
                },
            },
        });
    }
}
