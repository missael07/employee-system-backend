import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './entities/project.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsService {

  constructor(@InjectModel(Project.name) private projectModel: Model<Project>){}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const {name} = createProjectDto;

      const newProject = new this.projectModel({
        name
      });

      await newProject.save();

      const { ...project} = newProject.toJSON();

      return project;
      
    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${ createProjectDto.name} already exists!`);
      }
      else {
        throw new BadRequestException(`Bad request! error: ${error}` );
      }
    }
  }

  async findAll() {
    return await this.projectModel.find();
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id);
    if(project)
    return project;

    throw new NotFoundException();
  
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findById(id);
    
    if(project){

      project.name = updateProjectDto.name;
      project.save()
      
      return project;
    }

    throw new NotFoundException();
  }

  async remove(id: string) {
    const project = await this.projectModel.findById(id);

    if(project) {
      project.isActive = false;
      project.save();

      return project;
    }

    throw new NotFoundException();
  }
}
