import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

export enum Priority {
    NO_PRIORITY = 'no-priority',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Project {
    @Prop({ required: true })
    name: string;

    @Prop({ enum: Priority, default: Priority.NO_PRIORITY })
    priority: Priority;

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    lead?: Types.ObjectId;

    @Prop({ required: false })
    dueDate?: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);