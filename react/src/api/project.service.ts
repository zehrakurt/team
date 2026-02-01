// project.service.ts

import { httpService } from './service';
import type { Project, CreateProjectDto } from '../types';

export const projectService = {

  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await httpService.get<Project[]>('/projects');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Projeler listesi çekilemedi.';
      throw new Error(errorMessage);
    }
  },


  getProjectById: async (projectId: string): Promise<Project> => {
    try {
      const response = await httpService.get<Project>(`/projects/${projectId}`);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Proje detayı çekilemedi.';
      throw new Error(errorMessage);
    }
  },

  updateProject: async (projectId: string, updateData: Partial<Project>): Promise<Project> => {
    try {
      const response = await httpService.patch<Project>(`/projects/${projectId}`, updateData);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Proje güncellenirken bir hata oluştu.';
      throw new Error(errorMessage);
    }
  },


  createProject: async (projectData: CreateProjectDto): Promise<Project> => {
    try {
      // POST isteği ile proje verilerini backend'e gönderiyoruz
      const response = await httpService.post<Project>('/projects', projectData);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Proje oluşturulurken bir hata oluştu.';
      throw new Error(errorMessage);
    }
  },


deleteProject: async (projectId: string): Promise<{ message: string }> => {
  try {

    const response = await httpService.delete<{ message: string }>(`/projects/${projectId}`);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Proje silinirken bir hata oluştu.';
    throw new Error(errorMessage);
  }
},

};

