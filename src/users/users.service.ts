import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs'


// import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponse } from './dto';
import { User } from './entities/user.entity';
import { FilterConfigDto } from 'src/shared/dto/filter';
@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async findAll(): Promise<User[]>{
    const usersList = await this.userModel.find().populate([
      { path: 'roleId',},
      {
        path: 'teamId',
        populate: {
          path: 'projectId',
          model: 'Project',
        },
      },
    ]).exec();
    return usersList;
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id).populate([
      { path: 'roleId',},
      {
        path: 'teamId',
        populate: {
          path: 'projectId',
          model: 'Project',
        },
      },
    ]).exec();
  }

  async findUsersPaginated(filterConfigDto: FilterConfigDto){
    const { pageSize, pageIndex, sortBy, sortDirection, filterBy} = filterConfigDto;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortBy] = sortDirection;

    const query = filterBy ? { ['fullName']: { $regex: filterBy, $options: 'i' }  } : {};

    const [totalRows, data] =  await Promise.all([
      this.userModel.countDocuments(query),
      this.userModel.find(query).populate([
        { path: 'roleId',},
        {
          path: 'teamId',
          populate: {
            path: 'projectId',
            model: 'Project',
          },
        },
      ]).sort(sortOptions).skip(pageSize * pageIndex).limit(pageSize).exec()
    ])

    const response = <UserResponse> {
      totalRows,
      data
    }
    return response;
  }

  async finBy(email: string) {
    return await this.userModel.findOne({email});
  }

  async create(createUserDto: CreateUserDto) {

    try {
      const {email, name, lastName, teamId, roleId} = createUserDto;
      const currentDate = new Date()
      
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(`${process.env.COMPANY_PASSWORD}.${currentDate.getFullYear()}`, 10),
        employeeNumber: this.buildEmployeeNumber(),
        fullName: `${name} ${lastName}`,
        email,
        name,
        lastName,
        teamId,
        roleId
      });

      await newUser.save();

      const { password:_,...user} = (await newUser.populate([
        { path: 'roleId',},
        {
          path: 'teamId',
          populate: {
            path: 'projectId',
            model: 'Project',
          },
        },
      ])).toJSON();

      return user;
      
    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${ createUserDto.email} already exists!`);
      }
      else {
        throw new BadRequestException(`Bad request! error: ${error}` );
      }
    }
  }
  
  private buildEmployeeNumber(): number {

    const date = new Date(Date.now());
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const minutes = date.getUTCMinutes();
    const hours = date.getUTCHours();

    return Number.parseInt(`${year}${month + 1}${day}${hours+1}${minutes}`);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userModel.findById(id);
    
    if(user){

      user.name = updateUserDto.name;
      user.email = updateUserDto.email;
      user.lastName = updateUserDto.lastName;
      user.fullName = user.name + ' ' + user.lastName;
      user.roleId = updateUserDto.roleId;
      user.teamId = updateUserDto.teamId;
      user.isActive = updateUserDto.isActive;
      user.save()
      
      return user;
    }

    throw new NotFoundException();
  }

  async remove(id: string, statusDto: {status: boolean}) {
    const user = await this.userModel.findById(id);

    if(user) {
      user.isActive = statusDto.status;
      user.save();

      return user;
    }

    throw new NotFoundException();
  }
}
