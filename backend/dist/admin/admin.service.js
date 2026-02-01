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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const update_project_dto_1 = require("../projects/dto/update-project.dto");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalProjects, activeProjects, completedProjects, totalTasks, delayedTasks, newUsersThisMonth, projectStatusCounts, taskStatusCounts] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.project.count(),
            this.prisma.project.count({
                where: { status: update_project_dto_1.ProjectStatus.IN_PROGRESS }
            }),
            this.prisma.project.count({
                where: { status: update_project_dto_1.ProjectStatus.COMPLETED }
            }),
            this.prisma.task.count(),
            this.prisma.task.count({
                where: {
                    dueDate: {
                        lt: new Date()
                    },
                    status: {
                        not: client_1.TaskStatus.DONE
                    }
                }
            }),
            this.prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setDate(1))
                    }
                }
            }),
            this.prisma.project.groupBy({
                by: ['status'],
                _count: true
            }),
            this.prisma.task.groupBy({
                by: ['status'],
                _count: true
            })
        ]);
        const projectStatusDistribution = {
            planning: 0,
            inProgress: 0,
            completed: 0,
            onHold: 0
        };
        projectStatusCounts.forEach(status => {
            switch (status.status) {
                case update_project_dto_1.ProjectStatus.PLANNING:
                    projectStatusDistribution.planning = status._count;
                    break;
                case update_project_dto_1.ProjectStatus.IN_PROGRESS:
                    projectStatusDistribution.inProgress = status._count;
                    break;
                case update_project_dto_1.ProjectStatus.COMPLETED:
                    projectStatusDistribution.completed = status._count;
                    break;
                case update_project_dto_1.ProjectStatus.ON_HOLD:
                    projectStatusDistribution.onHold = status._count;
                    break;
            }
        });
        const taskStatusDistribution = {
            todo: 0,
            inProgress: 0,
            done: 0
        };
        taskStatusCounts.forEach((status) => {
            switch (status.status) {
                case client_1.TaskStatus.TODO:
                    taskStatusDistribution.todo = status._count;
                    break;
                case client_1.TaskStatus.IN_PROGRESS:
                    taskStatusDistribution.inProgress = status._count;
                    break;
                case client_1.TaskStatus.DONE:
                    taskStatusDistribution.done = status._count;
                    break;
            }
        });
        return {
            totalUsers,
            totalProjects,
            activeProjects,
            completedProjects,
            totalTasks,
            delayedTasks,
            newUsersThisMonth,
            projectStatusDistribution: {
                planning: projectStatusDistribution.planning,
                inProgress: projectStatusDistribution.inProgress,
                completed: projectStatusDistribution.completed,
                onHold: projectStatusDistribution.onHold
            },
            taskStatusDistribution
        };
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        projects: true,
                        ownedProjects: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async updateUserRole(userId, role) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        projects: true,
                        ownedProjects: true
                    }
                }
            }
        });
    }
    async approveUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: client_1.Role.USER },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        projects: true,
                        ownedProjects: true
                    }
                }
            }
        });
    }
    async disableUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user.role === client_1.Role.ADMIN) {
            throw new common_1.BadRequestException('Admin kullanıcısı devre dışı bırakılamaz');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: client_1.Role.USER },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        projects: true,
                        ownedProjects: true
                    }
                }
            }
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map