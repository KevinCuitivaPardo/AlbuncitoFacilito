import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { User, UsersService } from '../users/users.service.js';

export type AuthenticatedRequest = Request & { user: User };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }
    let userId: number;
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(token);
      userId = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }
    // Se consulta el usuario para rechazar tokens de cuentas que ya no existen
    const user = this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;
    return true;
  }
}
