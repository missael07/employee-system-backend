import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRole, RoleSchema } from './entities/role.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService],imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: UsersRole.name,
        schema: RoleSchema,
      },
    ]),
  ]
})
export class RolesModule {}
