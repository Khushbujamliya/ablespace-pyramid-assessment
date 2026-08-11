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
}