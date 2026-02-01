import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private prisma;
    private notificationsService;
    private activitiesService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, activitiesService: ActivitiesService);
    create(createTaskDto: CreateTaskDto, userId: number): Promise<{
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
    findAll(userId: number, userRole: string): Promise<({
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
    findOne(id: number, userId: number, userRole: string): Promise<{
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
    update(id: number, updateTaskDto: UpdateTaskDto, userId: number, userRole: string): Promise<any>;
    private getStatusText;
    remove(id: number, userId: number, userRole: string): Promise<{
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
    findTaskComments(id: number, userId: number, userRole: string): Promise<({
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
