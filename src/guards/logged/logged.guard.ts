import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LoggedGuard implements CanActivate {
  constructor(private _jwtService: JwtService, private authService: UsersService){}

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>{

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this._jwtService.verifyAsync<JwtPayload>(
        token,{ secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findUserById(payload.id);
      
      if(!user || !user.isActive)  throw new UnauthorizedException();

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
