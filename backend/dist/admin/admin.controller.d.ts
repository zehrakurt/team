import { AdminService } from './admin.service';
import { Role } from '@prisma/client';
interface UpdateUserRoleDto {
    role: Role;
}
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto): Promise<{
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
    approveUser(id: string): Promise<{
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
    disableUser(id: string): Promise<{
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
export {};
