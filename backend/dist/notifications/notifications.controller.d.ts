import { NotificationsService } from './notifications.service';
import { Request } from 'express';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: Request): Promise<{
        message: string;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.NotificationStatus;
        type: import(".prisma/client").$Enums.NotificationType;
        userId: number;
    }[]>;
    getUnreadCount(req: Request): Promise<{
        count: number;
    }>;
    markAsRead(id: string, req: Request): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: Request): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string, req: Request): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
