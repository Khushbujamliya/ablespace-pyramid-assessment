import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async guestLogin() {
        const guest = await this.usersService.createGuest();

        const payload = { sub: guest._id, isGuest: true };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: guest._id,
                fullName: guest.fullName,
                username: guest.username,
                isGuest: guest.isGuest,
            },
        };
    }

    async googleLogin(googleUser: { email: string; fullName: string; picture?: string }) {
        const user = await this.usersService.findOrCreateGoogleUser(googleUser);

        const payload = { sub: user._id, isGuest: false };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                isGuest: user.isGuest,
            },
        };
    }
}