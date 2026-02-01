"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMessage(senderId, createMessageDto) {
        const receiver = await this.prisma.user.findUnique({
            where: { id: createMessageDto.receiverId }
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Alıcı bulunamadı');
        }
        if (senderId === createMessageDto.receiverId) {
            throw new common_1.ForbiddenException('Kendinize mesaj gönderemezsiniz');
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
    async getUserMessages(userId) {
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
    async getConversation(userId, otherUserId) {
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
    async markMessageAsRead(messageId, userId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId }
        });
        if (!message) {
            throw new common_1.NotFoundException('Mesaj bulunamadı');
        }
        if (message.receiverId !== userId) {
            throw new common_1.ForbiddenException('Bu mesajı okundu olarak işaretleyemezsiniz');
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
    async getUnreadMessageCount(userId) {
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map