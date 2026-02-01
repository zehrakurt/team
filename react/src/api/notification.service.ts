import { httpService } from './service';

export interface Notification {
  id: number;
  type: 'PROJECT_ASSIGNED' | 'TASK_ASSIGNED' | 'ROLE_CHANGED' | 'SYSTEM_ANNOUNCEMENT' | 'TASK_DUE_SOON';
  title: string;
  message: string;
  status: 'READ' | 'UNREAD';
  createdAt: string;
  data?: any;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

class NotificationService {
  async getUserNotifications(): Promise<Notification[]> {
    const response = await httpService.get<Notification[]>('/notifications');
    return response;
  }

  async getUnreadCount(): Promise<number> {
    const response = await httpService.get<{count: number}>('/notifications/unread-count');
    return response.count;
  }

  async markAsRead(notificationId: number): Promise<void> {
    await httpService.patch(`/notifications/${notificationId}/read`, {});
  }

  async markAllAsRead(): Promise<void> {
    await httpService.patch('/notifications/mark-all-read', {});
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await httpService.delete(`/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService(); 