import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private activitiesService: ActivitiesService
  ) {}

  async create(taskId: string, authorId: string, createCommentDto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        taskId: parseInt(taskId),
        authorId: parseInt(authorId),
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Aktivite kaydı oluştur
    await this.activitiesService.createActivity({
      description: `Yorum eklendi: "${createCommentDto.content.substring(0, 50)}${createCommentDto.content.length > 50 ? '...' : ''}"`,
      userId: parseInt(authorId),
      taskId: parseInt(taskId)
    });

    return comment;
  }

  async findByTaskId(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId: parseInt(taskId) },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

  async update(authorId: string, id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id: parseInt(id) } });
    if (!comment || comment.authorId !== parseInt(authorId)) {
      throw new NotFoundException('Yorum bulunamadı veya yetkiniz yok');
    }
    return this.prisma.comment.update({
      where: { id: parseInt(id) },
      data: updateCommentDto,
    });
  }

  async remove(authorId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: parseInt(id) } });
    if (!comment || comment.authorId !== parseInt(authorId)) {
      throw new NotFoundException('Yorum bulunamadı veya yetkiniz yok');
    }
    return this.prisma.comment.delete({
      where: { id: parseInt(id) },
    });
  }
} 