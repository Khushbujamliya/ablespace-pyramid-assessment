import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Priority } from '../../projects/schemas/project.schema';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
    BACKLOG = 'backlog',
    TODO = 'todo',
    DOING = 'doing',
    COMPLETED = 'completed',
    ONHOLD = 'onhold',
}

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @Prop({ enum: Priority, default: Priority.NO_PRIORITY })
    priority: Priority;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    members: Types.ObjectId[];

    @Prop({ required: false })
    dueDate?: Date;

    @Prop({ required: false })
    startDate?: Date;

    @Prop({ required: false })
    endDate?: Date;

    @Prop({ type: Types.ObjectId, ref: 'Project', required: false })
    projectId?: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    labels: string[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    reporter: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);