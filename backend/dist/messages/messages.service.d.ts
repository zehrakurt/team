import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    createMessage(senderId: number, createMessageDto: CreateMessageDto): Promise<{
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
    getUserMessages(userId: number): Promise<({
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
    getConversation(userId: number, otherUserId: number): Promise<({
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
    markMessageAsRead(messageId: number, userId: number): Promise<{
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
    getUnreadMessageCount(userId: number): Promise<{
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
