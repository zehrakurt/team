import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JwtUser } from '../types/express';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: Request, @Body() createProjectDto: CreateProjectDto) {
    console.log('--- PROJE CONTROLLER: CREATE METODU ÇAĞRILDI ---');
    console.log('Gelen DTO:', createProjectDto);
    const user = req.user as JwtUser;
    console.log('Kullanıcı ID:', user.id);
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.projectsService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: Request, @Body() updateProjectDto: UpdateProjectDto) {
    const user = req.user as JwtUser;
    return this.projectsService.update(+id, updateProjectDto, user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Post(':id/users/:userId')
  addUserToProject(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.addUserToProject(+id, +userId);
  }

  @Delete(':id/users/:userId')
  removeUserFromProject(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeUserFromProject(+id, +userId);
  }

  @Get(':id/tasks')
  findProjectTasks(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.projectsService.findProjectTasks(+id, user.id);
  }

  @Get(':id/users')
  findProjectUsers(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.projectsService.findProjectUsers(+id, user.id);
  }
} 