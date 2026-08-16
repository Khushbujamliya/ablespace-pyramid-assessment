import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    getMe(@Req() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Patch('me')
    updateMe(@Body() body: UpdateUserDto, @Req() req: any) {
        return this.usersService.updateMe(req.user.userId, body);
    }
}