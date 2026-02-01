import { Controller, Get, Patch, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtUser } from '../types/express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.notificationsService.getUserNotifications(user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.notificationsService.markAsRead(parseInt(id), user.id);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.notificationsService.deleteNotification(parseInt(id), user.id);
  }
} 