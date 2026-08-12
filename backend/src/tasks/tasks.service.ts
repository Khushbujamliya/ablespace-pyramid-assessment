import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        private activityService: ActivityService,) { }

    create(dto: CreateTaskDto, reporterId: string) {
        const task = new this.taskModel({ ...dto, reporter: reporterId });
        return task.save();
    }

    findAll(filters: { status?: string; projectId?: string; search?: string }) {
        const query: any = {};
        if (filters.status) query.status = filters.status;
        if (filters.projectId) query.projectId = filters.projectId;
        if (filters.search) query.title = { $regex: filters.search, $options: 'i' };
        return this.taskModel.find(query).populate('members reporter projectId').exec();
    }

    findSubtasks(parentTaskId: string) {
        return this.taskModel.find({ parentTaskId }).populate('members reporter').exec();
    }

    async findOne(id: string) {
        const task = await this.taskModel.findById(id).populate('members reporter projectId').exec();
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, dto: UpdateTaskDto, actorId: string) {
        const before = await this.taskModel.findById(id).exec();
        if (!before) throw new NotFoundException('Task not found');

        const task = await this.taskModel.findByIdAndUpdate(id, dto, { new: true }).exec();

        if (dto.status && dto.status !== before.status) {
            await this.activityService.log(id, actorId, `changed status from ${before.status} to ${dto.status}`);
        }
        if (dto.priority && dto.priority !== before.priority) {
            await this.activityService.log(id, actorId, `changed priority from ${before.priority} to ${dto.priority}`);
        }
        return task;
    }

    async remove(id: string) {
        const result = await this.taskModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Task not found');
        return { deleted: true };
    }

    getActivity(id: string) {
        return this.activityService.findByTask(id);
    }
}