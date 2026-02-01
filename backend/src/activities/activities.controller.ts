import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('user')
  async getUserActivities(@Request() req) {
    return this.activitiesService.getUserActivities(req.user.id);
  }

  @Get('project/:id')
  async getProjectActivities(@Param('id') id: string) {
    return this.activitiesService.getProjectActivities(parseInt(id));
  }

  @Get('task/:id')
  async getTaskActivities(@Param('id') id: string) {
    return this.activitiesService.getTaskActivities(parseInt(id));
  }

  @Get('recent')
  async getRecentActivities() {
    return this.activitiesService.getRecentActivities(10);
  }
} 