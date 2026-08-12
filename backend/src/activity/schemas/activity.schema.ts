import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema({ timestamps: true })
export class Activity {
    @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
    taskId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    actor: Types.ObjectId;

    @Prop({ required: true })
    description: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);