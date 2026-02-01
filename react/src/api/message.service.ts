import { httpService } from './service';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface CreateMessageDto {
  content: string;
  receiverId: number;
}

class MessageService {
  async createMessage(data: CreateMessageDto): Promise<Message> {
    const response = await httpService.post<Message>('/messages', data);
    return response;
  }

  async getUserMessages(): Promise<Message[]> {
    const response = await httpService.get<Message[]>('/messages');
    return response;
  }

  async getConversation(userId: number): Promise<Message[]> {
    const response = await httpService.get<Message[]>(`/messages/conversation/${userId}`);
    return response;
  }

  async markMessageAsRead(messageId: number): Promise<Message> {
    const response = await httpService.post<Message>(`/messages/${messageId}/read`, {});
    return response;
  }

  async getUnreadMessageCount(): Promise<{ count: number }> {
    const response = await httpService.get<{ count: number }>('/messages/unread/count');
    return response;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await httpService.get<User[]>('/messages/users');
    return response;
  }
}

export const messageService = new MessageService(); 