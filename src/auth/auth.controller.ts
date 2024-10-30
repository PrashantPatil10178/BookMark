import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './DTO';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    signIn(@Body() SignInDTO: SignInDTO) {
        return this.authService.SignIn(SignInDTO);
    }

    @Post('signup')
    async SignUp(@Body() SignUpDTO: SignUpDTO) {
        return this.authService.SignUp(SignUpDTO);
    }
}
