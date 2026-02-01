import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JwtUser } from '../types/express';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('test')
  testUsers() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.usersService.findOne(user.id);
  }

  @Get('admin/stats')
  @Roles(Role.ADMIN)
  async getAdminStats() {
    return this.usersService.getAdminStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get(':id/projects')
  findUserProjects(@Param('id') id: string) {
    return this.usersService.findUserProjects(+id);
  }

  @Get(':id/tasks')
  findUserTasks(@Param('id') id: string) {
    return this.usersService.findUserTasks(+id);
  }
}
