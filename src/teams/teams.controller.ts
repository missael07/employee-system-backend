import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto , UpdateTeamDto} from './dto';
import { FilterConfigDto } from 'src/shared/dto/filter';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string,  @Body() statusDto: {status: boolean}) {
    return this.teamsService.remove(id, statusDto);
  }

  @Post('GetPaginatedTeams')
  getPaginatedProjects(@Body() filterConfigDto: FilterConfigDto){
    return this.teamsService.findTeamsPaginated(filterConfigDto);
  }
}
