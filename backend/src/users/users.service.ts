import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async createGuest(): Promise<UserDocument> {
        const guestNumber = Math.floor(1000 + Math.random() * 9000);
        const guest = new this.userModel({
            fullName: `Guest`,
            username: `guest${guestNumber}`,
            isGuest: true,
        });
        return guest.save();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().select('fullName username avatar email').exec();
    }

    async updateMe(userId: string, updates: { fullName?: string; username?: string; title?: string }): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, updates, { new: true }).exec();
    }

    async findOrCreateGoogleUser(googleUser: { email: string; fullName: string; picture?: string }): Promise<UserDocument> {
        const existing = await this.userModel.findOne({ email: googleUser.email }).exec();
        if (existing) return existing;

        const usernameBase = googleUser.email.split('@')[0];
        const user = new this.userModel({
            email: googleUser.email,
            fullName: googleUser.fullName,
            username: usernameBase,
            avatar: googleUser.picture,
            isGuest: false,
        });
        return user.save();
    }
}