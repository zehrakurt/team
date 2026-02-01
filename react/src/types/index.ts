export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  description?: string;
  assigneeId?: string;
  assignee?: User;
  projectId: string;
  priority?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  progress?: number;
  owner: User;
  users: User[];
  tasks: Task[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  userIds?: number[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  authorId: string;
  author: User;
}

export interface CreateCommentDto {
  content: string;
  taskId: string;
}

export interface Activity {
  id: string;
  description: string;
  createdAt: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  user: User;
  project?: Project;
  task?: Task;
} 