import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    create(dto: CreateTaskDto, reporterId: string) {
        const task = new this.taskModel({ ...dto, reporter: reporterId });
        return task.save();
    }

    findAll() {
        return this.taskModel.find().populate('members reporter projectId').exec();
    }

    async findOne(id: string) {
        const task = await this.taskModel.findById(id).populate('members reporter projectId').exec();
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, dto: UpdateTaskDto) {
        const task = await this.taskModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async remove(id: string) {
        const result = await this.taskModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Task not found');
        return { deleted: true };
    }
}