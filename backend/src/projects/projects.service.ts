import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) { }

    create(dto: CreateProjectDto, ownerId: string) {
        const project = new this.projectModel({ ...dto, owner: ownerId });
        return project.save();
    }

    findAll() {
        return this.projectModel.find().populate('lead owner').exec();
    }

    async findOne(id: string) {
        const project = await this.projectModel.findById(id).populate('lead owner').exec();
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async update(id: string, dto: UpdateProjectDto) {
        const project = await this.projectModel
            .findByIdAndUpdate(id, dto, { new: true })
            .populate('lead owner')
            .exec();
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async remove(id: string) {
        const result = await this.projectModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Project not found');
        return { deleted: true };
    }
}