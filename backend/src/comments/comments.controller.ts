import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtUser } from '../types/express';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':taskId')
  create(@Req() req: Request, @Param('taskId') taskId: string, @Body() createCommentDto: CreateCommentDto) {
    const user = req.user as JwtUser;
    return this.commentsService.create(taskId, user.id.toString(), createCommentDto);
  }

  @Get(':taskId')
  findByTaskId(@Param('taskId') taskId: string) {
    return this.commentsService.findByTaskId(taskId);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    const user = req.user as JwtUser;
    return this.commentsService.update(user.id.toString(), id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as JwtUser;
    return this.commentsService.remove(user.id.toString(), id);
  }
} 