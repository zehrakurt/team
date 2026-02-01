import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

interface UpdateUserRoleDto {
  role: Role;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.adminService.updateUserRole(parseInt(id), updateUserRoleDto.role);
  }

  @Put('users/:id/approve')
  async approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(parseInt(id));
  }

  @Put('users/:id/disable')
  async disableUser(@Param('id') id: string) {
    return this.adminService.disableUser(parseInt(id));
  }
} 