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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activities_service_1 = require("../activities/activities.service");
let CommentsService = class CommentsService {
    constructor(prisma, activitiesService) {
        this.prisma = prisma;
        this.activitiesService = activitiesService;
    }
    async create(taskId, authorId, createCommentDto) {
        const comment = await this.prisma.comment.create({
            data: {
                ...createCommentDto,
                taskId: parseInt(taskId),
                authorId: parseInt(authorId),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        await this.activitiesService.createActivity({
            description: `Yorum eklendi: "${createCommentDto.content.substring(0, 50)}${createCommentDto.content.length > 50 ? '...' : ''}"`,
            userId: parseInt(authorId),
            taskId: parseInt(taskId)
        });
        return comment;
    }
    async findByTaskId(taskId) {
        return this.prisma.comment.findMany({
            where: { taskId: parseInt(taskId) },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
    }
    async update(authorId, id, updateCommentDto) {
        const comment = await this.prisma.comment.findUnique({ where: { id: parseInt(id) } });
        if (!comment || comment.authorId !== parseInt(authorId)) {
            throw new common_1.NotFoundException('Yorum bulunamadı veya yetkiniz yok');
        }
        return this.prisma.comment.update({
            where: { id: parseInt(id) },
            data: updateCommentDto,
        });
    }
    async remove(authorId, id) {
        const comment = await this.prisma.comment.findUnique({ where: { id: parseInt(id) } });
        if (!comment || comment.authorId !== parseInt(authorId)) {
            throw new common_1.NotFoundException('Yorum bulunamadı veya yetkiniz yok');
        }
        return this.prisma.comment.delete({
            where: { id: parseInt(id) },
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activities_service_1.ActivitiesService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map