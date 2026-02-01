import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../../api/project.service';
import { userService } from '../../api/user.service';
import './Project.scss';
import { FiUsers, FiClipboard, FiInfo, FiCalendar, FiUser, FiPlusCircle } from 'react-icons/fi';
import type { Project, Task } from '../../types';
import CreateTaskModal from '../Task/CreateTaskModal';
import { getRoleInfo } from '../../utils/roles';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [projectData, userData] = await Promise.all([
          projectService.getProjectById(id),
          userService.getProfile()
        ]);
        setProject(projectData);
        setCurrentUser(userData);
      } catch (err: any) {
        console.error('ProjectDetail fetchData error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setError(err.message || 'Proje detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleTaskCreated = (newTask: Task) => {
    if (project) {
      setProject({
        ...project,
        tasks: [...(project.tasks || []), newTask],
      });
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project || !id) return;

    setUpdating(true);
    try {
      const updatedProject = await projectService.updateProject(id, { status: newStatus });
      setProject(updatedProject);
    } catch (err: any) {
      setError(err.message || 'Proje durumu güncellenirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return '#4A90E2';
      case 'in_progress': return '#74b9ff';
      case 'on_hold': return '#fd79a8';
      case 'completed': return '#00b894';
      default: return '#ddd';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'Planlama';
      case 'in_progress': return 'Devam Ediyor';
      case 'on_hold': return 'Beklemede';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  if (loading) {
    return <div className="detail-page-loading"><div className="loader"></div><p>Proje Yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="detail-page-error"><p>⚠️ {error}</p></div>;
  }

  if (!project) {
    return <div className="detail-page-error"><p>Proje bulunamadı.</p></div>;
  }

  return (
    <>
      <div className="project-detail-container">
        <header className="project-detail-header">
          <h1>{project.name}</h1>
          <div className="owner-info">
            <FiUser /> Proje Sahibi: <strong>{project.owner.firstName.toUpperCase()} {project.owner.lastName.toUpperCase()}</strong>
          </div>
        </header>
        
        <main className="project-detail-main">
          <div className="project-detail-grid">
            <div className="detail-card info-card">
              <h3 className="card-header"><FiInfo /> Proje Bilgileri</h3>
              <p>{project.description}</p>
              <div className="project-dates">
                {project.startDate && <span><FiCalendar /> <strong>Başlangıç:</strong> {new Date(project.startDate).toLocaleDateString()}</span>}
                {project.endDate && <span><FiCalendar /> <strong>Bitiş:</strong> {new Date(project.endDate).toLocaleDateString()}</span>}
              </div>
              <div className="project-status">
                <strong>Durum:</strong> 
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(project.status || 'planning') }}
                >
                  {getStatusText(project.status || 'planning')}
                </span>
              </div>
            </div>
            
            {isAdmin && (
              <div className="detail-card status-card">
                <h3 className="card-header">Durum Güncelle</h3>
                <div className="status-actions">
                  <button
                    onClick={() => handleStatusUpdate('PLANNING')}
                    disabled={updating || project.status === 'PLANNING'}
                    className={`status-button ${project.status === 'PLANNING' ? 'active' : ''}`}
                  >
                    Planlama
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    disabled={updating || project.status === 'IN_PROGRESS'}
                    className={`status-button ${project.status === 'IN_PROGRESS' ? 'active' : ''}`}
                  >
                    Devam Ediyor
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('ON_HOLD')}
                    disabled={updating || project.status === 'ON_HOLD'}
                    className={`status-button ${project.status === 'ON_HOLD' ? 'active' : ''}`}
                  >
                    Beklemede
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={updating || project.status === 'COMPLETED'}
                    className={`status-button ${project.status === 'COMPLETED' ? 'active' : ''}`}
                  >
                    Tamamlandı
                  </button>
                </div>
                {updating && <p className="updating-message">Güncelleniyor...</p>}
              </div>
            )}
            
            <div className="detail-card team-card">
              <h3 className="card-header"><FiUsers /> Proje Ekibi</h3>
              <ul className="user-list">
                {project.users.map(user => {
                  const roleInfo = getRoleInfo(user.role);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <li key={user.id} className="user-item">
                      <div className="user-info">
                        <div className="user-avatar">
                          <RoleIcon style={{ color: roleInfo.color }} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</span>
                          <span className="user-email">{user.email}</span>
                          <span className="user-role" style={{ color: roleInfo.color }}>
                            {roleInfo.label}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="detail-card tasks-card">
              <div className="card-header">
                <h3><FiClipboard /> Görevler</h3>
                {isAdmin && (
                  <button className="add-task-button" onClick={() => setIsModalOpen(true)}>
                    <FiPlusCircle /> Yeni Görev Ekle
                  </button>
                )}
              </div>
              <ul className="task-list">
                {(project.tasks?.length || 0) > 0 ? (
                  project.tasks.map(task => (
                    <li key={task.id} className={`task-item status-${task.status.toLowerCase()}`}>
                      <span className="task-title">{task.title}</span>
                      <span className="task-status">{task.status}</span>
                    </li>
                  ))
                ) : (
                  <p className="no-tasks-message">Bu projeye henüz görev eklenmemiş.</p>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={parseInt(project.id, 10)}
      />
    </>
  );
};

export default ProjectDetail; 