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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ProjectsService = class ProjectsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createProjectDto, ownerId) {
        const { userIds, ...projectData } = createProjectDto;
        const projectCreateData = {
            ...projectData,
            owner: {
                connect: { id: ownerId },
            },
        };
        if (projectCreateData.startDate) {
            projectCreateData.startDate = new Date(projectCreateData.startDate);
        }
        if (projectCreateData.endDate) {
            projectCreateData.endDate = new Date(projectCreateData.endDate);
        }
        if (userIds && userIds.length > 0) {
            projectCreateData.users = {
                connect: userIds.map((id) => ({ id })),
            };
        }
        const project = await this.prisma.project.create({
            data: projectCreateData,
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
        if (userIds && userIds.length > 0) {
            for (const userId of userIds) {
                if (userId !== ownerId) {
                    await this.notificationsService.notifyProjectAssigned(userId, project.id, project.name);
                }
            }
        }
        return project;
    }
    async findAll(userId) {
        return this.prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { users: { some: { id: userId } } }
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
    }
    async findOne(id, userId) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                OR: [
                    { ownerId: userId },
                    { users: { some: { id: userId } } }
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                tasks: {
                    include: {
                        assignee: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            }
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, updateProjectDto, userId) {
        await this.findOne(id, userId);
        const data = { ...updateProjectDto };
        if (data.status) {
            data.status = data.status;
        }
        return this.prisma.project.update({
            where: { id },
            data,
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
    }
    async remove(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        await this.prisma.project.delete({ where: { id } });
        return { message: `Project with ID ${id} successfully deleted.` };
    }
    async addUserToProject(projectId, userToAddId) {
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                users: {
                    connect: [{ id: userToAddId }]
                }
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
    }
    async removeUserFromProject(projectId, userToRemoveId) {
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                users: {
                    disconnect: [{ id: userToRemoveId }]
                }
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
    }
    async findProjectTasks(projectId, userId) {
        const project = await this.findOne(projectId, userId);
        return project.tasks;
    }
    async findProjectUsers(projectId, userId) {
        const project = await this.findOne(projectId, userId);
        return project.users;
    }
    async updateUsersOnProject(projectId, userIds) {
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                users: {
                    set: userIds.map((id) => ({ id })),
                },
            },
            include: {
                users: true,
            }
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map