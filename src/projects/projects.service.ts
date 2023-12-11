import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, ProjectResponse, UpdateProjectDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './entities/project.entity';
import { Model } from 'mongoose';
import { FilterConfigDto } from '../shared/dto/filter';

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

  async findProjectsPaginated(filterConfigDto: FilterConfigDto){
    const { pageSize, pageIndex, sortBy, sortDirection, filterBy} = filterConfigDto;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortBy] = sortDirection;

    const query = filterBy ? { ['name']: filterBy } : {};

    const [totalRows, data] =  await Promise.all([
      this.projectModel.countDocuments(query),
      this.projectModel.find(query).sort(sortOptions).skip(pageSize * pageIndex).limit(pageSize).exec()
    ])
    
    const response = <ProjectResponse> {
      totalRows,
      data
    }
    return response;
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
