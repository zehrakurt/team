import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async createActivity(data: {
    description: string;
    userId: number;
    projectId?: number;
    taskId?: number;
  }) {
    return this.prisma.activity.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });
  }

  async getUserActivities(userId: number) {
    return this.prisma.activity.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async getProjectActivities(projectId: number) {
    return this.prisma.activity.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async getTaskActivities(taskId: number) {
    return this.prisma.activity.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async getRecentActivities(limit: number = 10) {
    return this.prisma.activity.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        task: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
} 