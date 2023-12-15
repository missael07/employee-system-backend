import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from './interfaces/login-response';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { MappingService } from 'src/mapping/mapping.service';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _mappService: MappingService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).populate([
      { path: 'roleId',},
      {
        path: 'teamId',
        populate: {
          path: 'projectId',
          model: 'Project',
        },
      },
    ]);
    if (!user  || !bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials');
    }

    const userVM = this._mappService.mapUserToUserVM(user);
    const reponse = {
      token: this.getJwtToken({ id: user.id }),
      user: userVM,
    };

    return reponse;
  }



  getJwtToken(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);

    return token;
  }
}
