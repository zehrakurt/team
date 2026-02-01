import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        totalTasks: number;
        delayedTasks: number;
        newUsersThisMonth: number;
        projectStatusDistribution: {
            planning: number;
            inProgress: number;
            completed: number;
            onHold: number;
        };
        taskStatusDistribution: {
            todo: number;
            inProgress: number;
            done: number;
        };
    }>;
    getAllUsers(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projects: number;
            ownedProjects: number;
        };
    }[]>;
    updateUserRole(userId: number, role: Role): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projects: number;
            ownedProjects: number;
        };
    }>;
    approveUser(userId: number): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projects: number;
            ownedProjects: number;
        };
    }>;
    disableUser(userId: number): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projects: number;
            ownedProjects: number;
        };
    }>;
}
