import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import type { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.roles);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const refreshTokenMatches = await this.usersService.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user.id, user.email, user.roles);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.setRefreshToken(userId, undefined);
    return { message: 'Logout successful' };
  }

  private async getTokens(userId: string, email: string, roles: string[]) {
    // const [accessToken, refreshToken] = await Promise.all([
    //   this.jwtService.signAsync(
    //     {
    //       sub: userId,
    //       email,
    //       roles,
    //     },
    //     {
    //       secret: this.configService.get('JWT_SECRET'),
    //       expiresIn: this.configService.get('JWT_EXPIRATION', '1d'),
    //     },
    //   ),
    //   this.jwtService.signAsync(
    //     {
    //       sub: userId,
    //     },
    //     {
    //       secret: this.configService.get('JWT_REFRESH_SECRET'),
    //       expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
    //     },
    //   ),
    // ]);

    const [accessToken, refreshToken] = ['accessToken', 'refreshToken'];

    return {
      accessToken,
      refreshToken,
    };
  }
}
