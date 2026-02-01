import { httpService } from './service';

export interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  delayedTasks: number;
  newUsersThisMonth: number;
  projectStatusDistribution: {
    todo: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  taskStatusDistribution: {
    todo: number;
    inProgress: number;
    done: number;
  };
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    projects: number;
    ownedProjects: number;
  };
}

export const adminService = {

  async getDashboardStats(): Promise<DashboardStats> {
    return httpService.get<DashboardStats>('/admin/dashboard');
  },

 
  async getAllUsers(): Promise<AdminUser[]> {
    return httpService.get<AdminUser[]>('/admin/users');
  },

  async updateUserRole(userId: number, role: string): Promise<AdminUser> {
    return httpService.put<AdminUser>(`/admin/users/${userId}/role`, { role });
  },

  async approveUser(userId: number): Promise<AdminUser> {
    return httpService.put<AdminUser>(`/admin/users/${userId}/approve`, {});
  },


  async disableUser(userId: number): Promise<AdminUser> {
    return httpService.put<AdminUser>(`/admin/users/${userId}/disable`, {});
  }
}; 