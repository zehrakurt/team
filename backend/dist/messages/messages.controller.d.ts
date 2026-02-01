import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    createMessage(req: Request, createMessageDto: CreateMessageDto): Promise<{
        sender: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
        receiver: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        receiverId: number;
        isRead: boolean;
        senderId: number;
    }>;
    getUserMessages(req: Request): Promise<({
        sender: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
        receiver: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        receiverId: number;
        isRead: boolean;
        senderId: number;
    })[]>;
    getConversation(req: Request, userId: string): Promise<({
        sender: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
        receiver: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        receiverId: number;
        isRead: boolean;
        senderId: number;
    })[]>;
    markMessageAsRead(req: Request, messageId: string): Promise<{
        sender: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
        receiver: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        receiverId: number;
        isRead: boolean;
        senderId: number;
    }>;
    getUnreadMessageCount(req: Request): Promise<{
        count: number;
    }>;
    getAllUsers(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
}
