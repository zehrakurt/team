import { httpService } from './service';
import type { Comment, CreateCommentDto } from '../types';

export const commentService = {
  async getTaskComments(taskId: string): Promise<Comment[]> {
    return httpService.get<Comment[]>(`/comments/${taskId}`);
  },

  async createComment(data: CreateCommentDto): Promise<Comment> {
    return httpService.post<Comment>(`/comments/${data.taskId}`, { 
      content: data.content,
      taskId: parseInt(data.taskId)
    });
  },

  async updateComment(id: string, content: string): Promise<Comment> {
    return httpService.put<Comment>(`/comments/${id}`, { content });
  },

  async deleteComment(id: string): Promise<void> {
    return httpService.delete<void>(`/comments/${id}`);
  }
}; 