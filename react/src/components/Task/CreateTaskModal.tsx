import React, { useState, useEffect } from 'react';
import { taskService } from '../../api/task.service';
import { projectService } from '../../api/project.service';
import type { CreateTaskData } from '../../api/task.service';
import type { Project } from '../../types';
import { useNotifications } from '../Notification/NotificationContext';
import './Task.scss';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: any) => void;
  projectId: number;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onTaskCreated, projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);

  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isOpen && projectId) {
      projectService.getProjectById(projectId.toString())
        .then(setProject)
        .catch(err => {
          console.error('CreateTaskModal fetchProject error:', err);
          if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
            localStorage.removeItem('token');
            window.dispatchEvent(new Event('tokenChanged'));
            return;
          }
          setError('Proje bilgileri yüklenirken hata oluştu.');
        });
    }
  }, [isOpen, projectId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!assigneeId) {
      setError('Lütfen bir kullanıcı seçin.');
      setLoading(false);
      return;
    }

    const taskData: CreateTaskData = {
      title,
      description,
      projectId,
      assigneeId,
    };

    try {
      const newTask = await taskService.createTask(taskData);
      onTaskCreated(newTask);
      onClose();
      setTitle('');
      setDescription('');
      setAssigneeId(undefined);
    } catch (err: any) {
      setError(err.message || 'Görev oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Yeni Görev Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Görev Başlığı</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Örn: Login sayfasını tasarla"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Açıklama (Opsiyonel)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görevle ilgili detayları buraya yazın..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignee">Atanan Kişi</label>
            <select
              id="assignee"
              value={assigneeId || ''}
              onChange={(e) => setAssigneeId(e.target.value ? parseInt(e.target.value) : undefined)}
              required
            >
              <option value="" disabled>Bir kullanıcı seçin</option>
              {project?.users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary" disabled={loading}>
              İptal
            </button>
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? 'Oluşturuluyor...' : 'Görevi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal; 