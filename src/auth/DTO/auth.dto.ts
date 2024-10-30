import { IsEmail, isEmail, IsNotEmpty, isNotEmpty } from 'class-validator';
import { isModuleNamespaceObject } from 'util/types';

export class SignUpDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    lastName: string;
}

export class SignInDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
