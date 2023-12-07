import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs'


// import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async create(createUserDto: CreateUserDto) {

    try {
      const {email, name, lastName} = createUserDto;
      const currentDate = new Date()
      
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(`${process.env.COMPANY_PASSWORD}.${currentDate.getFullYear()}`, 10),
        employeeNumber: this.buildEmployeeNumber(),
        fullName: `${name} ${lastName}`,
        email,
        name,
        lastName
      });

      await newUser.save();

      const { password:_,...user} = newUser.toJSON();

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

  async findAll(): Promise<User[]>{
    const usersList = await this.userModel.find();
    return usersList;
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userModel.findById(id);
    
    if(user){

      user.name = updateUserDto.name;
      user.email = updateUserDto.email;
      user.lastName = updateUserDto.lastName;
      user.fullName = user.name + ' ' + user.lastName;
      user.save()
      
      return user;
    }

    throw new NotFoundException();
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);

    if(user) {
      user.isActive = false;
      user.save();

      return user;
    }

    throw new NotFoundException();
  }
}
