import { Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('guest')
    async guestLogin() {
        return this.authService.guestLogin();
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Passport handles the redirect to Google's login page
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req: any, @Res() res: Response) {
        const result = await this.authService.googleLogin(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        res.redirect(
            `${frontendUrl}/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`,
        );
    }
}