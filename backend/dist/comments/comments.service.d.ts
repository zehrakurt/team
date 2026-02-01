import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private prisma;
    private activitiesService;
    constructor(prisma: PrismaService, activitiesService: ActivitiesService);
    create(taskId: string, authorId: string, createCommentDto: CreateCommentDto): Promise<{
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
    }>;
    findByTaskId(taskId: string): Promise<({
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
    update(authorId: string, id: string, updateCommentDto: UpdateCommentDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        taskId: number;
        content: string;
        authorId: number;
    }>;
    remove(authorId: string, id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        taskId: number;
        content: string;
        authorId: number;
    }>;
}
