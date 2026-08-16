import { IsString, IsOptional, IsEnum, IsDateString, IsMongoId } from 'class-validator';
import { Priority } from '../schemas/project.schema';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsMongoId()
    lead?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

}