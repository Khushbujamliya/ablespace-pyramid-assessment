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
}