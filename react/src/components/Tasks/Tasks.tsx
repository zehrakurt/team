import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../../api/task.service';
import { userService } from '../../api/user.service';
import { projectService } from '../../api/project.service';
import type { Task, User, Project } from '../../types';
import './Tasks.scss';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedTasks, fetchedUsers, fetchedProjects] = await Promise.all([
          taskService.getAllTasks(),
          userService.getUsers(),
          projectService.getProjects()
        ]);
        
        console.log('Fetched tasks:', fetchedTasks);
        console.log('Fetched users:', fetchedUsers);
        console.log('Fetched projects:', fetchedProjects);
        
        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
        setProjects(fetchedProjects);
      } catch (err: any) {
        console.error('Tasks fetchData error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setError(err.message || 'Görevler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo': return '#6c5ce7';
      case 'in_progress': return '#74b9ff';
      case 'done': return '#00b894';
      case 'blocked': return '#fd79a8';
      default: return '#ddd';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo': return 'Yapılacak';
      case 'in_progress': return 'Yapılıyor';
      case 'done': return 'Tamamlandı';
      case 'blocked': return 'Engellendi';
      default: return status;
    }
  };

  const getUserName = (userId: number | string | null | undefined) => {
    console.log('getUserName called with userId:', userId, 'type:', typeof userId);
    if (!userId) return 'Bilinmeyen Kullanıcı';
    
    const user = users.find(u => String(u.id) === String(userId));
    console.log('Found user:', user);
    
    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`.toUpperCase();
      console.log('Returning fullName:', fullName);
      return fullName;
    }
    return 'Bilinmeyen Kullanıcı';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Bilinmeyen Proje';
  };

  if (loading) {
    return <div className="tasks-container"><p>Görevler Yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="tasks-container"><p>Hata: {error}</p></div>;
  }

  return (
    <div className="tasks-container">
      <h1>Görevler</h1>
      {tasks.length === 0 ? (
        <p>Henüz görev bulunmuyor.</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="task-card"
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <span 
                  className="task-status"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusText(task.status)}
                </span>
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <div className="task-footer">
                <small>Proje: {getProjectName(task.projectId)}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks; 