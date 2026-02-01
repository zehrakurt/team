import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    getUserActivities(req: any): Promise<({
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
    getProjectActivities(id: string): Promise<({
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
    getTaskActivities(id: string): Promise<({
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
    getRecentActivities(): Promise<({
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
