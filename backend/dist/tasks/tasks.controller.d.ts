import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: Request, createTaskDto: CreateTaskDto): Promise<{
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
    }>;
    findAll(req: Request): Promise<({
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
    findOne(id: string, req: Request): Promise<{
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
    }>;
    update(id: string, req: Request, updateTaskDto: UpdateTaskDto): Promise<any>;
    remove(id: string, req: Request): Promise<{
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
    }>;
    findTaskComments(id: string, req: Request): Promise<({
        author: {
            email: string;
            firstName: string;
            lastName: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        taskId: number;
        content: string;
        authorId: number;
    })[]>;
}
