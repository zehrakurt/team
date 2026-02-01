import { httpService } from './service';
import type { Task } from '../types';

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: number;
  assigneeId: number;
}

export const taskService = {

  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await httpService.get<Task[]>('/tasks');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Görevler listelenirken bir hata oluştu.';
      throw new Error(errorMessage);
    }
  },


  getTaskById: async (taskId: string): Promise<Task> => {
    try {
      const response = await httpService.get<Task>(`/tasks/${taskId}`);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Görev detayı çekilemedi.';
      throw new Error(errorMessage);
    }
  },


  updateTask: async (taskId: string, updateData: Partial<Task>): Promise<Task> => {
    try {
      const response = await httpService.patch<Task>(`/tasks/${taskId}`, updateData);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Görev güncellenirken bir hata oluştu.';
      throw new Error(errorMessage);
    }
  },

 
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    try {
      const response = await httpService.post<Task>('/tasks', taskData);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Görev oluşturulurken bir hata oluştu.';
      throw new Error(errorMessage);
    }
  },
}; 