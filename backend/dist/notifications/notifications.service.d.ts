import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export interface CreateNotificationDto {
    type: NotificationType;
    title: string;
    message: string;
    userId: number;
    data?: any;
}
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }>;
    getUserNotifications(userId: number): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }[]>;
    getUnreadCount(userId: number): Promise<number>;
    markAsRead(notificationId: number, userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(notificationId: number, userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyProjectAssigned(userId: number, projectId: number, projectName: string): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }>;
    notifyTaskAssigned(userId: number, taskId: number, taskTitle: string): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }>;
    notifyRoleChanged(userId: number, newRole: string): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }>;
    notifySystemAnnouncement(userIds: number[], title: string, message: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyTaskDueSoon(userId: number, taskId: number, taskTitle: string, dueDate: Date): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }>;
}
