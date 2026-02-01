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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const activities_service_1 = require("../activities/activities.service");
let TasksService = class TasksService {
    constructor(prisma, notificationsService, activitiesService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.activitiesService = activitiesService;
    }
    async create(createTaskDto, userId) {
        const task = await this.prisma.task.create({
            data: {
                ...createTaskDto,
                assigneeId: createTaskDto.assigneeId,
            },
            include: {
                project: true,
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        await this.notificationsService.notifyTaskAssigned(createTaskDto.assigneeId, task.id, task.title);
        return task;
    }
    async findAll(userId, userRole) {
        if (userRole === 'ADMIN') {
            const tasks = await this.prisma.task.findMany({
                include: {
                    project: true,
                    assignee: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return tasks;
        }
        const tasks = await this.prisma.task.findMany({
            where: {
                assigneeId: userId,
            },
            include: {
                project: true,
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return tasks;
    }
    async findOne(id, userId, userRole) {
        if (userRole === 'ADMIN') {
            return this.prisma.task.findFirst({
                where: {
                    id,
                },
                include: {
                    project: true,
                    assignee: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
        }
        return this.prisma.task.findFirst({
            where: {
                id,
                assigneeId: userId,
            },
            include: {
                project: true,
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async update(id, updateTaskDto, userId, userRole) {
        let task;
        if (userRole === 'ADMIN') {
            task = await this.prisma.task.update({
                where: {
                    id,
                },
                data: updateTaskDto,
            });
        }
        else {
            task = await this.prisma.task.update({
                where: {
                    id,
                    assigneeId: userId,
                },
                data: updateTaskDto,
            });
        }
        if (updateTaskDto.status) {
            const statusText = this.getStatusText(updateTaskDto.status);
            await this.activitiesService.createActivity({
                description: `Görev durumu "${statusText}" olarak güncellendi`,
                userId: userId,
                taskId: id
            });
        }
        return task;
    }
    getStatusText(status) {
        switch (status) {
            case 'TODO': return 'Yapılacak';
            case 'IN_PROGRESS': return 'Yapılıyor';
            case 'DONE': return 'Tamamlandı';
            case 'BLOCKED': return 'Engellendi';
            default: return status;
        }
    }
    async remove(id, userId, userRole) {
        if (userRole === 'ADMIN') {
            return this.prisma.task.delete({
                where: {
                    id,
                },
            });
        }
        return this.prisma.task.delete({
            where: {
                id,
                assigneeId: userId,
            },
        });
    }
    async findTaskComments(id, userId, userRole) {
        if (userRole === 'ADMIN') {
            return this.prisma.comment.findMany({
                where: {
                    taskId: id,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        return this.prisma.comment.findMany({
            where: {
                taskId: id,
                task: {
                    assigneeId: userId,
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        activities_service_1.ActivitiesService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map