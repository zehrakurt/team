import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private activitiesService: ActivitiesService
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        assigneeId: createTaskDto.assigneeId,
      },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await this.notificationsService.notifyTaskAssigned(
      createTaskDto.assigneeId,
      task.id,
      task.title
    );

    return task;
  }

  async findAll(userId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      const tasks = await this.prisma.task.findMany({
        include: {
          project: true,
          assignee: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return tasks;
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return tasks;
  }

  async findOne(id: number, userId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      return this.prisma.task.findFirst({
        where: {
          id,
        },
        include: {
          project: true,
          assignee: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    }

    return this.prisma.task.findFirst({
      where: {
        id,
        assigneeId: userId,
      },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number, userRole: string) {
    let task;
    
    if (userRole === 'ADMIN') {
      task = await this.prisma.task.update({
        where: {
          id,
        },
        data: updateTaskDto,
      });
    } else {
      task = await this.prisma.task.update({
        where: {
          id,
          assigneeId: userId,
        },
        data: updateTaskDto,
      });
    }

    // Aktivite kaydı oluştur
    if (updateTaskDto.status) {
      const statusText = this.getStatusText(updateTaskDto.status);
      await this.activitiesService.createActivity({
        description: `Görev durumu "${statusText}" olarak güncellendi`,
        userId: userId,
        taskId: id
      });
    }

    return task;
  }

  private getStatusText(status: string): string {
    switch (status) {
      case 'TODO': return 'Yapılacak';
      case 'IN_PROGRESS': return 'Yapılıyor';
      case 'DONE': return 'Tamamlandı';
      case 'BLOCKED': return 'Engellendi';
      default: return status;
    }
  }

  async remove(id: number, userId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      return this.prisma.task.delete({
        where: {
          id,
        },
      });
    }

    return this.prisma.task.delete({
      where: {
        id,
        assigneeId: userId,
      },
    });
  }

  async findTaskComments(id: number, userId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      return this.prisma.comment.findMany({
        where: {
          taskId: id,
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return this.prisma.comment.findMany({
      where: {
        taskId: id,
        task: {
          assigneeId: userId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
} 