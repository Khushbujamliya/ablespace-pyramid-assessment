import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schemas/task.schema';
import { ActivityModule } from '../activity/activity.module';
// add ActivityModule to the imports: [] array

@Module({
    imports:
        [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), ActivityModule,
        ],
    providers: [TasksService],
    controllers: [TasksController],
    exports: [MongooseModule],
})
export class TasksModule { }