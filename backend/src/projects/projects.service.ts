import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: number) {
    const { userIds, ...projectData } = createProjectDto;

    const projectCreateData: any = {
      ...projectData,
      owner: {
        connect: { id: ownerId },
      },
    };

    if (projectCreateData.startDate) {
      projectCreateData.startDate = new Date(projectCreateData.startDate);
    }
    if (projectCreateData.endDate) {
      projectCreateData.endDate = new Date(projectCreateData.endDate);
    }

    if (userIds && userIds.length > 0) {
      projectCreateData.users = {
        connect: userIds.map((id) => ({ id })),
      };
    }

    const project = await this.prisma.project.create({
      data: projectCreateData,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        if (userId !== ownerId) {
          await this.notificationsService.notifyProjectAssigned(
            userId,
            project.id,
            project.name
          );
        }
      }
    }

    return project;
  }

  async findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { users: { some: { id: userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
  }

  async findOne(id: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { users: { some: { id: userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {
    await this.findOne(id, userId);

    const data: any = { ...updateProjectDto };
    if (data.status) {
      data.status = data.status as any;
    }

    return this.prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
  }

  async remove(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.prisma.project.delete({ where: { id } });
    return { message: `Project with ID ${id} successfully deleted.` };
  }

  async addUserToProject(projectId: number, userToAddId: number) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          connect: [{ id: userToAddId }]
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
  }

  async removeUserFromProject(projectId: number, userToRemoveId: number) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          disconnect: [{ id: userToRemoveId }]
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
  }

  async findProjectTasks(projectId: number, userId: number) {
    const project = await this.findOne(projectId, userId);
    return project.tasks;
  }

  async findProjectUsers(projectId: number, userId: number) {
    const project = await this.findOne(projectId, userId);
    return project.users;
  }

  async updateUsersOnProject(projectId: number, userIds: number[]) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          set: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: true,
      }
    });
  }
}