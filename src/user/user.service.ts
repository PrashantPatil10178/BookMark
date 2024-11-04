import { Injectable } from '@nestjs/common';
import { EditUserDto } from './Dto';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
    constructor(private Prisma: DbService) {}
    async EditUser(id: number, Dto: EditUserDto) {
        try {
            if (!Object.keys(Dto).length)
                return { message: 'Enter Fields to edit ' };
            console.log(Dto);
            const user = await this.Prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    ...Dto,
                },
            });
            delete user.password;

            return { message: 'The User Edited Sucessfully', user };
        } catch (error) {
            return error;
        }
    }
}
