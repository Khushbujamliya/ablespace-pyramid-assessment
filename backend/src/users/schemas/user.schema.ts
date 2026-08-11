import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: false, unique: true, sparse: true })
    email?: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: false })
    title?: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: false })
    avatar?: string;

    @Prop({ required: true, default: false })
    isGuest: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);