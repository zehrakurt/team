import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role, TaskStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password && updateUserDto.currentPassword) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
      const isMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Mevcut şifre yanlış');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    } else if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    delete updateUserDto.currentPassword;
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }

  async findUserProjects(userId: number) {
    const user = await this.findOne(userId);
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

  async findUserTasks(userId: number) {
    const user = await this.findOne(userId);
    return this.prisma.task.findMany({
      where: {
        assigneeId: userId
      },
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        project: true
      }
    });
  }

  async getAdminStats() {
    const [totalUsers, totalProjects, tasks] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.task.findMany({
        select: {
          status: true,
        },
      }),
    ]);

    const activeTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;

    return {
      totalUsers,
      totalProjects,
      activeTasks,
      completedTasks,
    };
  }
}
