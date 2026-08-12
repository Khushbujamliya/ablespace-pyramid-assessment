import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    ) { }

    log(taskId: string, actorId: string, description: string) {
        return new this.activityModel({ taskId, actor: actorId, description }).save();
    }

    findByTask(taskId: string) {
        return this.activityModel.find({ taskId }).populate('actor').sort({ createdAt: -1 }).exec();
    }
}