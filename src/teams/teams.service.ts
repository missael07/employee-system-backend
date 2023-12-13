import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto, TeamResponse } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './entities/team.entity';
import { Model } from 'mongoose';
import { FilterConfigDto } from 'src/shared/dto/filter';

@Injectable()
export class TeamsService {

  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
      const {teamName, projectId} = createTeamDto;
      
      let currentDate = new Date();
      const newTeam = new this.teamModel({
        teamName,
        projectId,
        createdAt: currentDate
      });

      await newTeam.save();

      const { ...team} = (await newTeam.populate('projectId')).toJSON();

      return team;
      
    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${ createTeamDto.teamName} already exists!`);
      }
      else {
        throw new BadRequestException(`Bad request! error: ${error}` );
      }
    }
  }

  async findAll() {
    return await this.teamModel.find().populate('projectId');
  }

  async findTeamsPaginated(filterConfigDto: FilterConfigDto){
    const { pageSize, pageIndex, sortBy, sortDirection, filterBy} = filterConfigDto;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortBy] = sortDirection;

    const query = filterBy ? { ['teamName']: { $regex: filterBy, $options: 'i' }  } : {};

    const [totalRows, data] =  await Promise.all([
      this.teamModel.countDocuments(query),
      this.teamModel.find(query).populate('projectId').sort(sortOptions).skip(pageSize * pageIndex).limit(pageSize).exec()
    ])
    
    const response = <TeamResponse> {
      totalRows,
      data
    }
    return response;
  }

  async findOne(id: string) {
    return await this.teamModel.findById(id).populate('projectId');
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {

    const team = await this.teamModel.findById(id).populate('projectId')
    if(team){
      let currentDate = new Date();
      team.teamName = updateTeamDto.teamName;
      team.updatedAt = currentDate;
      team.projectId = updateTeamDto.projectId;      
      team.save();
      return team;
    }
    return this.teamModel.find().populate('projectId');
  }

  async remove(id: string, statusDto: {status: boolean}) {

    const team = await this.teamModel.findById(id).populate('projectId');
    if(team){
      let currentDate = new Date();

      team.isActive = statusDto.status;
      team.updatedAt = currentDate;
      team.save();
      return team;
    }

    throw new NotFoundException();
  }
}
