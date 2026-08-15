import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    getMe(@Req() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @Patch('me')
    updateMe(@Body() body: { fullName?: string; username?: string }, @Req() req: any) {
        return this.usersService.updateMe(req.user.userId, body);
    }
}