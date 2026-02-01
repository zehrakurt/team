import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationStatus } from '@prisma/client';

export interface CreateNotificationDto {
  type: NotificationType;
  title: string;
  message: string;
  userId: number;
  data?: any;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        type: createNotificationDto.type,
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        userId: createNotificationDto.userId,
        data: createNotificationDto.data || {}
      }
    });
  }

  async getUserNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: { 
        userId,
        status: NotificationStatus.UNREAD
      }
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { 
        id: notificationId,
        userId
      },
      data: { status: NotificationStatus.READ }
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { 
        userId,
        status: NotificationStatus.UNREAD
      },
      data: { status: NotificationStatus.READ }
    });
  }

  async deleteNotification(notificationId: number, userId: number) {
    return this.prisma.notification.deleteMany({
      where: { 
        id: notificationId,
        userId
      }
    });
  }

  async notifyProjectAssigned(userId: number, projectId: number, projectName: string) {
    return this.createNotification({
      type: NotificationType.PROJECT_ASSIGNED,
      title: 'Yeni Proje Atandı',
      message: `"${projectName}" projesine atandınız.`,
      userId,
      data: { projectId }
    });
  }

  async notifyTaskAssigned(userId: number, taskId: number, taskTitle: string) {
    return this.createNotification({
      type: NotificationType.TASK_ASSIGNED,
      title: 'Yeni Görev Atandı',
      message: `"${taskTitle}" görevi size atandı.`,
      userId,
      data: { taskId }
    });
  }

  async notifyRoleChanged(userId: number, newRole: string) {
    return this.createNotification({
      type: NotificationType.ROLE_CHANGED,
      title: 'Rol Değişikliği',
      message: `Rolünüz "${newRole}" olarak güncellendi.`,
      userId,
      data: { newRole }
    });
  }

  async notifySystemAnnouncement(userIds: number[], title: string, message: string) {
    const notifications = userIds.map(userId => ({
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title,
      message,
      userId,
      data: {}
    }));

    return this.prisma.notification.createMany({
      data: notifications
    });
  }

  async notifyTaskDueSoon(userId: number, taskId: number, taskTitle: string, dueDate: Date) {
    return this.createNotification({
      type: NotificationType.TASK_DUE_SOON,
      title: 'Görev Deadline Yaklaşıyor',
      message: `"${taskTitle}" görevinin bitiş tarihi ${dueDate.toLocaleDateString()} tarihinde.`,
      userId,
      data: { taskId, dueDate }
    });
  }
} 