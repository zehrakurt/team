import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JwtUser } from '../types/express';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    const user = req.user as JwtUser;
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.findOne(+id, user.id, user.role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: Request, @Body() updateTaskDto: UpdateTaskDto) {
    const user = req.user as JwtUser;
    return this.tasksService.update(+id, updateTaskDto, user.id, user.role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.remove(+id, user.id, user.role);
  }

  @Get(':id/comments')
  findTaskComments(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.findTaskComments(+id, user.id, user.role);
  }
} 