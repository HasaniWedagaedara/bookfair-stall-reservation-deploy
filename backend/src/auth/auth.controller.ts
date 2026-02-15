import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import type { AuthRequest } from './types/request.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Register endpoint
  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      businessName: string;
      mobileNumber: string;
    },
    @Res() res: Response,
  ) {

    if (!body) {
    return res.status(400).json({ message: "Request body missing" });
  }
    const { user, token } = await this.authService.register(
      body.email,
      body.password,
      body.name,
      body.businessName,
      body.mobileNumber,
    );

    return res
      .status(201)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: 'none',
      })
      .json(user);
  }

  // User login endpoint
  @Post('user/login')
  @HttpCode(200)
  async userLogin(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {

    if (!body) {
    return res.status(400).json({ message: "Request body missing" });
  }
  
    return await this.authService.userLogin(body.email, body.password, res);
  }

  // Admin login endpoint
  @Post('admin/login')
  @HttpCode(200)
  async adminLogin(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    return await this.authService.adminLogin(body.email, body.password, res);
  }

  // Get current user (protected route)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: AuthRequest) {
    return await this.authService.getCurrentUser(req.user.id);
  }

  // Logout endpoint (protected route)
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }

  // Example: Admin-only route
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/dashboard')
  getAdminDashboard() {
    return { message: 'Welcome to Admin Dashboard!' };
  }
}
