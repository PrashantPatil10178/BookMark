import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './DTO';
import { DbService } from '../db/db.service';
import * as argon from 'argon2';
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        private prisma: DbService,
        private JWT: JwtService,
    ) {}

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
            return {
                user,
                message: 'You have Been Sucessfully Signed Up',
                AccessToken: await this.signToken(user.id, user.email),
            };
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
        delete user.password;
        if (pass) {
            return {
                user,
                message: 'You have been SignIn Sucessfully',
                AccessTokken: await this.signToken(user.id, user.email),
            };
        } else {
            return { message: 'Wrong Credentials' };
        }
    }

    async signToken(userId: number, email: string): Promise<string> {
        const payload = { sub: userId, email };
        const secret = this.config.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT secret is not defined');
        }

        try {
            return await this.JWT.signAsync(payload, {
                expiresIn: '15m',
                secret,
            });
        } catch (error) {
            console.error('Error signing token:', error);
            throw new Error('Failed to sign token');
        }
    }
}
