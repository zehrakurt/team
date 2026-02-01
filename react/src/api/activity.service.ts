import { httpService } from './service';
import type { Activity } from '../types';

export const activityService = {
  async getUserActivities(): Promise<Activity[]> {
    return httpService.get<Activity[]>('/activities/user');
  },

  async getProjectActivities(projectId: string): Promise<Activity[]> {
    return httpService.get<Activity[]>(`/activities/project/${projectId}`);
  },

  async getTaskActivities(taskId: string): Promise<Activity[]> {
    return httpService.get<Activity[]>(`/activities/task/${taskId}`);
  },

  async getRecentActivities(): Promise<Activity[]> {
    return httpService.get<Activity[]>('/activities/recent');
  }
}; 