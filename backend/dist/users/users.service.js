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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    async findOne(id) {
        if (!id) {
            throw new common_1.NotFoundException('User ID is required');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password && updateUserDto.currentPassword) {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException('Kullanıcı bulunamadı');
            const isMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
            if (!isMatch) {
                throw new common_1.BadRequestException('Mevcut şifre yanlış');
            }
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        else if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        delete updateUserDto.currentPassword;
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.delete({ where: { id } });
    }
    async findUserProjects(userId) {
        const user = await this.findOne(userId);
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
    async findUserTasks(userId) {
        const user = await this.findOne(userId);
        return this.prisma.task.findMany({
            where: {
                assigneeId: userId
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                project: true
            }
        });
    }
    async getAdminStats() {
        const [totalUsers, totalProjects, tasks] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.project.count(),
            this.prisma.task.findMany({
                select: {
                    status: true,
                },
            }),
        ]);
        const activeTasks = tasks.filter(task => task.status === client_1.TaskStatus.IN_PROGRESS).length;
        const completedTasks = tasks.filter(task => task.status === client_1.TaskStatus.DONE).length;
        return {
            totalUsers,
            totalProjects,
            activeTasks,
            completedTasks,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map