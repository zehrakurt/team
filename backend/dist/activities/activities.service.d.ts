import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    createActivity(data: {
        description: string;
        userId: number;
        projectId?: number;
        taskId?: number;
    }): Promise<{
        user: {
            firstName: string;
            lastName: string;
            id: number;
        };
        project: {
            id: number;
            name: string;
        };
        task: {
            title: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        description: string;
        projectId: number | null;
        userId: number;
        taskId: number | null;
    }>;
    getUserActivities(userId: number): Promise<({
        user: {
            firstName: string;
            lastName: string;
            id: number;
        };
        project: {
            id: number;
            name: string;
        };
        task: {
            title: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        description: string;
        projectId: number | null;
        userId: number;
        taskId: number | null;
    })[]>;
    getProjectActivities(projectId: number): Promise<({
        user: {
            firstName: string;
            lastName: string;
            id: number;
        };
        project: {
            id: number;
            name: string;
        };
        task: {
            title: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        description: string;
        projectId: number | null;
        userId: number;
        taskId: number | null;
    })[]>;
    getTaskActivities(taskId: number): Promise<({
        user: {
            firstName: string;
            lastName: string;
            id: number;
        };
        project: {
            id: number;
            name: string;
        };
        task: {
            title: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        description: string;
        projectId: number | null;
        userId: number;
        taskId: number | null;
    })[]>;
    getRecentActivities(limit?: number): Promise<({
        user: {
            firstName: string;
            lastName: string;
            id: number;
        };
        project: {
            id: number;
            name: string;
        };
        task: {
            title: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        description: string;
        projectId: number | null;
        userId: number;
        taskId: number | null;
    })[]>;
}
