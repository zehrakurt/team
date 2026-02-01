import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    testUsers(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getProfile(req: Request): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAdminStats(): Promise<{
        totalUsers: number;
        totalProjects: number;
        activeTasks: number;
        completedTasks: number;
    }>;
    findOne(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
    findUserProjects(id: string): Promise<({
        owner: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
        users: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
        startDate: Date | null;
        endDate: Date | null;
        ownerId: number;
    })[]>;
    findUserTasks(id: string): Promise<({
        project: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: import(".prisma/client").$Enums.ProjectStatus;
            startDate: Date | null;
            endDate: Date | null;
            ownerId: number;
        };
        assignee: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
    } & {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        projectId: number;
        assigneeId: number | null;
    })[]>;
}
