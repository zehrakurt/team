import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectService } from '../../api/project.service';
import { userService } from '../../api/user.service';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './Project.scss';

interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProjects(filtered);
    }
  }, [projects, searchTerm]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProjects = await projectService.getProjects();
      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
    } catch (err: any) {
      console.error('Projects fetchProjects error:', err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('tokenChanged'));
        return;
      }
      setError('Projeler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userProfile = await userService.getProfile();
      setUser(userProfile);
    } catch (err: any) {
      console.error('Projects fetchUserProfile error:', err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('tokenChanged'));
        return;
      }
      console.error('Kullanıcı profili çekilemedi:', err);
    }
  };

  const handleCreateProjectClick = () => {
    navigate('/projects/create');
  };

  const handleEdit = (projectId: string) => {
    navigate(`/projects/edit/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    setDeleteLoading(projectId);
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err: any) {
      alert(err.message || 'Proje silinirken bir hata oluştu.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="projects-container loading">
        <p>Projeler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Projeler</h2>
        {user && user.role === 'ADMIN' && (
          <button onClick={handleCreateProjectClick} className="create-project-button">
            + Yeni Proje Oluştur
          </button>
        )}
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Projelerde ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="clear-search-button"
          >
            Temizle
          </button>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <p>
          {searchTerm ? 'Arama kriterlerinize uygun proje bulunamadı.' : 'Henüz bir projeniz bulunmamaktadır.'} 
          {user && user.role === 'ADMIN' && !searchTerm && ' Yeni bir proje oluşturmak için yukarıdaki butonu kullanın.'}
        </p>
      ) : (
        <div className="projects-list">
          {filteredProjects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} className="project-card-link">
              <div className="project-card">
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}
                <div className="project-card-footer">
                  <div className="project-meta">
                    {project.startDate && (
                      <span>
                        <b>Başlangıç:</b> {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {project.endDate && (
                      <span>
                        <b>Bitiş:</b> {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {user && user.role === 'ADMIN' && (
                    <div className="project-actions">
                      <button
                        className="edit-project-button"
                        onClick={(e) => { e.preventDefault(); handleEdit(project.id); }}
                        title="Projeyi Düzenle"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="delete-project-button"
                        onClick={(e) => { e.preventDefault(); handleDelete(project.id); }}
                        disabled={deleteLoading === project.id}
                        title="Projeyi Sil"
                      >
                        {deleteLoading === project.id ? (
                          <span className="loader">...</span>
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;