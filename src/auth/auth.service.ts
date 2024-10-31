import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './DTO';
import { DbService } from 'src/db/db.service';
import * as argon from 'argon2';
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: DbService) {}

    async SignUp(SignUpDTO: SignUpDTO) {
        try {
            let { email, password, name, lastName } = SignUpDTO;

            let hash = await argon.hash(password);

            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hash,
                    name,
                    lastName,
                },
            });

            delete user.password;
            console.log(user);
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    return { error, message: 'The User is Already Registred' };
                else return error;
            } else {
                return {
                    error,
                };
            }
        }
    }

    async SignIn(SignInDTO: SignInDTO) {
        let { email, password } = SignInDTO;
        const user = await this.prisma.user.findUnique({ where: { email } });
        console.log(user);
        if (!user) {
            throw new ForbiddenException('Incorrect Credentials');
        }
        const pass = await argon.verify(user.password, password);
        if (pass) {
            return { message: 'You have been SignIn Sucessfully' };
        } else {
            return { message: 'Wrong Credentials' };
        }
    }
}
