import { BadRequestException, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs'


// import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { DateTime } from 'msnodesqlv8';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
