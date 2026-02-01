import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createProjectDto: CreateProjectDto, ownerId: number): Promise<{
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
    }>;
    findAll(userId: number): Promise<({
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
    findOne(id: number, userId: number): Promise<{
        tasks: ({
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
        })[];
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
    }>;
    update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<{
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
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    addUserToProject(projectId: number, userToAddId: number): Promise<{
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
    }>;
    removeUserFromProject(projectId: number, userToRemoveId: number): Promise<{
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
    }>;
    findProjectTasks(projectId: number, userId: number): Promise<({
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
    findProjectUsers(projectId: number, userId: number): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
    }[]>;
    updateUsersOnProject(projectId: number, userIds: number[]): Promise<{
        users: {
            email: string;
            password: string;
            firstName: string | null;
            lastName: string | null;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
}
