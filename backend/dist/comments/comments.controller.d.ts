import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(req: Request, taskId: string, createCommentDto: CreateCommentDto): Promise<{
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
    update(req: Request, id: string, updateCommentDto: UpdateCommentDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        taskId: number;
        content: string;
        authorId: number;
    }>;
    remove(req: Request, id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        taskId: number;
        content: string;
        authorId: number;
    }>;
}
