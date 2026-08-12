import { IsString, IsOptional, IsEnum, IsDateString, IsMongoId, IsArray } from 'class-validator';
import { TaskStatus, Label } from '../schemas/task.schema';
import { Priority } from '../../projects/schemas/project.schema';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    members?: string[];

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsMongoId()
    projectId?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(Label, { each: true })
    labels?: Label[];

    @IsOptional()
    @IsMongoId()
    parentTaskId?: string;
}