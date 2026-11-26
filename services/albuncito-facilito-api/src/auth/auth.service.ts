import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UsersService } from '../users/users.service.js';
import type { LoginDto, SignupDto } from './auth.schemas.js';
import { PasswordService } from './password.service.js';

export interface AuthResult {
  accessToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ name, email, password }: SignupDto): Promise<AuthResult> {
    if (this.usersService.findByEmail(email)) {
      throw new ConflictException('El email ya está registrado');
    }
    const passwordHash = await this.passwordService.hash(password);
    const user = this.usersService.create(name, email, passwordHash);
    return this.buildResult(user);
  }

  async login({ email, password }: LoginDto): Promise<AuthResult> {
    const found = this.usersService.findByEmail(email);
    // Siempre se verifica, aunque el email no exista, para no revelar qué emails están registrados
    const valid = await this.passwordService.verify(password, found?.passwordHash);
    if (!found || !valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const { id, name, slug } = found;
    return this.buildResult({ id, name, slug, email: found.email });
  }

  private async buildResult(user: User): Promise<AuthResult> {
    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    return { accessToken, user };
  }
}
