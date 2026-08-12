import { IsString, IsMongoId } from 'class-validator';

export class CreateCommentDto {
    @IsMongoId()
    taskId: string;

    @IsString()
    text: string;
}