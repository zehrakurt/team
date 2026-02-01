import { httpService } from './service'; 


interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}


interface Task {
  id: string;

}


interface Project {
  id: string;

}

interface AuthResponse {
  access_token: string;
  user: User;
}

const userService = {

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await httpService.post<AuthResponse>('/auth/login', { email, password });
      return response; 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Giriş başarısız oldu.';
      throw new Error(errorMessage);
    }
  },

  
  getProfile: async (): Promise<User> => {
    try {
      const response = await httpService.get<User>('/users/profile');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profil bilgileri çekilemedi.';
      throw new Error(errorMessage);
    }
  },


  getUsers: async (): Promise<User[]> => { 
    try {
      const response = await httpService.get<User[]>('/users');
      return response; 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Kullanıcılar listesi çekilemedi.';
      throw new Error(errorMessage);
    }
  },

  getUserTasks: async (userId: string): Promise<Task[]> => {
    try {
      const response = await httpService.get<Task[]>(`/users/${userId}/tasks`);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Kullanıcının görevleri çekilemedi: ${userId}`;
      throw new Error(errorMessage);
    }
  },


  register: async (registerDto: any): Promise<AuthResponse> => {
    try {
      const response = await httpService.post<AuthResponse>('/auth/register', registerDto);
      return response; 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Kayıt başarısız oldu.';
      throw new Error(errorMessage);
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
  
    window.dispatchEvent(new Event('tokenChanged'));
  },

 
  updateProfile: async (userId: string, profileData: { firstName: string; lastName: string; email: string }) => {
    try {
      const response = await httpService.patch(`/users/${userId}`, profileData);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profil güncellenemedi.';
      throw new Error(errorMessage);
    }
  },


  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    try {
   
      const response = await httpService.patch(`/users/${userId}`, { currentPassword, password: newPassword });
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Şifre değiştirilemedi.';
      throw new Error(errorMessage);
    }
  },
};

export { userService };
