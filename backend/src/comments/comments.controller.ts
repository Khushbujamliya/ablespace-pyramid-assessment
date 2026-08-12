import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) { }

    @Post()
    create(@Body() dto: CreateCommentDto, @Req() req: any) {
        return this.commentsService.create(dto, req.user.userId);
    }

    @Get('task/:taskId')
    findByTask(@Param('taskId') taskId: string) {
        return this.commentsService.findByTask(taskId);
    }
}