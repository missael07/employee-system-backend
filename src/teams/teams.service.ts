import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './entities/team.entity';
import { Model } from 'mongoose';

@Injectable()
export class TeamsService {

  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
      const {teamName, projectId} = createTeamDto;
      
      const newTeam = new this.teamModel({
        teamName,
        projectId
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

  async findOne(id: string) {
    return await this.teamModel.findById(id).populate('projectId');
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {

    const team = await this.teamModel.findById(id).populate('projectId')
    if(team){
      team.teamName = updateTeamDto.teamName;
      team.save();
      return team;
    }
    return this.teamModel.find().populate('projectId');
  }

  async remove(id: string) {

    const team = await this.teamModel.findById(id).populate('projectId');
    if(team){
      team.isActive = false;
      team.save();
      return team;
    }

    throw new NotFoundException();
  }
}
