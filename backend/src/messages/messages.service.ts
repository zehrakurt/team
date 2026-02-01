import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: number, createMessageDto: CreateMessageDto) {
    const receiver = await this.prisma.user.findUnique({
      where: { id: createMessageDto.receiverId }
    });

    if (!receiver) {
      throw new NotFoundException('Alıcı bulunamadı');
    }

    if (senderId === createMessageDto.receiverId) {
      throw new ForbiddenException('Kendinize mesaj gönderemezsiniz');
    }

    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        senderId: senderId,
        receiverId: createMessageDto.receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    return message;
  }

  async getUserMessages(userId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getConversation(userId: number, otherUserId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId },
              { receiverId: otherUserId }
            ]
          },
          {
            AND: [
              { senderId: otherUserId },
              { receiverId: userId }
            ]
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async markMessageAsRead(messageId: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.receiverId !== userId) {
      throw new ForbiddenException('Bu mesajı okundu olarak işaretleyemezsiniz');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  }

  async getUnreadMessageCount(userId: number) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });
    
    return { count };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
      orderBy: {
        firstName: 'asc'
      }
    });
  }
} 