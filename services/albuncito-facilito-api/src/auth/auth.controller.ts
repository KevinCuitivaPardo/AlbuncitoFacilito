import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { loginSchema, signupSchema, type LoginDto, type SignupDto } from './auth.schemas.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard, type AuthenticatedRequest } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body({ schema: signupSchema }) body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body({ schema: loginSchema }) body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
