import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Post()
    create(@Body() dto: CreateTaskDto, @Req() req: any) {
        return this.tasksService.create(dto, req.user.userId);
    }

    @Get()
    findAll(@Query('status') status?: string, @Query('projectId') projectId?: string, @Query('search') search?: string) {
        return this.tasksService.findAll({ status, projectId, search });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Get(':id/subtasks')
    findSubtasks(@Param('id') id: string) {
        return this.tasksService.findSubtasks(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req: any) {
        return this.tasksService.update(id, dto, req.user.userId);
    }

    @Get(':id/activity')
    getActivity(@Param('id') id: string) {
        return this.tasksService.getActivity(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}