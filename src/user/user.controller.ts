import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './Dto';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';

@Controller('users')
export class UserController {
    constructor(private UserService: UserService) {}

    @UseGuards(JwtGuard)
    @Get()
    getData(@Req() req: Request) {
        return req.user;
    }
    @UseGuards(JwtGuard)
    @Patch('editUser')
    editData(@GetUser('id') id: number, @Body() dto: EditUserDto) {
        return this.UserService.EditUser(id, dto);
    }
}
