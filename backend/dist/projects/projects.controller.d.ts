import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request } from 'express';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: Request, createProjectDto: CreateProjectDto): Promise<{
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
    findAll(req: Request): Promise<({
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
    findOne(id: string, req: Request): Promise<{
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
    update(id: string, req: Request, updateProjectDto: UpdateProjectDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
    addUserToProject(id: string, userId: string): Promise<{
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
    removeUserFromProject(id: string, userId: string): Promise<{
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
    findProjectTasks(id: string, req: Request): Promise<({
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
    findProjectUsers(id: string, req: Request): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: number;
    }[]>;
}
