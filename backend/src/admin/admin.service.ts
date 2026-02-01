import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, Role } from '@prisma/client';
import { ProjectStatus } from '../projects/dto/update-project.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      delayedTasks,
      newUsersThisMonth,
      projectStatusCounts,
      taskStatusCounts
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.project.count(),

      this.prisma.project.count({
        where: { status: ProjectStatus.IN_PROGRESS }
      }),

      this.prisma.project.count({
        where: { status: ProjectStatus.COMPLETED }
      }),

      this.prisma.task.count(),

      this.prisma.task.count({
        where: {
          dueDate: {
            lt: new Date()
          },
          status: {
            not: TaskStatus.DONE
          }
        }
      }),

      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1))
          }
        }
      }),

      this.prisma.project.groupBy({
        by: ['status'],
        _count: true
      }),

      this.prisma.task.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    const projectStatusDistribution = {
      planning: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0
    };

    projectStatusCounts.forEach(status => {
      switch (status.status) {
        case ProjectStatus.PLANNING:
          projectStatusDistribution.planning = status._count;
          break;
        case ProjectStatus.IN_PROGRESS:
          projectStatusDistribution.inProgress = status._count;
          break;
        case ProjectStatus.COMPLETED:
          projectStatusDistribution.completed = status._count;
          break;
        case ProjectStatus.ON_HOLD:
          projectStatusDistribution.onHold = status._count;
          break;
      }
    });

    const taskStatusDistribution = {
      todo: 0,
      inProgress: 0,
      done: 0
    };

    taskStatusCounts.forEach((status: { status: TaskStatus; _count: number }) => {
      switch (status.status) {
        case TaskStatus.TODO:
          taskStatusDistribution.todo = status._count;
          break;
        case TaskStatus.IN_PROGRESS:
          taskStatusDistribution.inProgress = status._count;
          break;
        case TaskStatus.DONE:
          taskStatusDistribution.done = status._count;
          break;
      }
    });

    return {
      totalUsers,
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      delayedTasks,
      newUsersThisMonth,
      projectStatusDistribution: {
        planning: projectStatusDistribution.planning,
        inProgress: projectStatusDistribution.inProgress,
        completed: projectStatusDistribution.completed,
        onHold: projectStatusDistribution.onHold
      },
      taskStatusDistribution
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            ownedProjects: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateUserRole(userId: number, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            ownedProjects: true
          }
        }
      }
    });
  }

  async approveUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Kullanıcıyı USER rolüne yükselt (varsayılan olarak USER olarak kayıt olur)
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.USER },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            ownedProjects: true
          }
        }
      }
    });
  }

  async disableUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Admin kullanıcısı devre dışı bırakılamaz');
    }

    // Kullanıcıyı USER rolüne düşür (devre dışı bırakma)
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.USER },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            ownedProjects: true
          }
        }
      }
    });
  }
} 