import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtUser } from '../types/express';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(@Req() req: Request, @Body() createMessageDto: CreateMessageDto) {
    const user = req.user as JwtUser;
    return this.messagesService.createMessage(user.id, createMessageDto);
  }

  @Get()
  async getUserMessages(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.messagesService.getUserMessages(user.id);
  }

  @Get('conversation/:userId')
  async getConversation(@Req() req: Request, @Param('userId') userId: string) {
    const user = req.user as JwtUser;
    return this.messagesService.getConversation(user.id, parseInt(userId));
  }

  @Post(':id/read')
  async markMessageAsRead(@Req() req: Request, @Param('id') messageId: string) {
    const user = req.user as JwtUser;
    return this.messagesService.markMessageAsRead(parseInt(messageId), user.id);
  }

  @Get('unread/count')
  async getUnreadMessageCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.messagesService.getUnreadMessageCount(user.id);
  }

  @Get('users')
  async getAllUsers() {
    return this.messagesService.getAllUsers();
  }
} 