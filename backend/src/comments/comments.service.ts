import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    ) { }

    create(dto: CreateCommentDto, authorId: string) {
        const comment = new this.commentModel({ ...dto, author: authorId });
        return comment.save();
    }

    findByTask(taskId: string) {
        return this.commentModel.find({ taskId }).populate('author').sort({ createdAt: 1 }).exec();
    }
}