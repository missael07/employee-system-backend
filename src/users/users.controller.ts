import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { FilterConfigDto } from '../shared/dto/filter';
import { LoggedGuard } from 'src/guards/logged/logged.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LoggedGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LoggedGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(LoggedGuard)
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @UseGuards(LoggedGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(LoggedGuard)
  @Delete(':id')
  remove(@Param('id') id: string,  @Body() statusDto: {status: boolean}) {
    return this.usersService.remove(id, statusDto);
  }
  
  @UseGuards(LoggedGuard)
  @Post('GetPaginatedUsers')
  getPaginatedUsers(@Body() filterConfigDto: FilterConfigDto){
    return this.usersService.findUsersPaginated(filterConfigDto);
  }
}
