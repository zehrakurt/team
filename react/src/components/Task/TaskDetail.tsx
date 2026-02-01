import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../api/task.service';
import { commentService } from '../../api/comment.service';
import { activityService } from '../../api/activity.service';
import type { Task, Comment, Activity } from '../../types';
import './Task.scss';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchTaskDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [taskData, commentsData, activitiesData] = await Promise.all([
          taskService.getTaskById(id),
          commentService.getTaskComments(id),
          activityService.getTaskActivities(id)
        ]);
        setTask(taskData);
        setComments(commentsData);
        setActivities(activitiesData);
      } catch (err: any) {
        console.error('TaskDetail fetchTaskDetails error:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setError(err.message || 'Görev detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!task || !id) return;

    setUpdating(true);
    try {
      const updatedTask = await taskService.updateTask(id, { status: newStatus });
      setTask(updatedTask);
      
      const activitiesData = await activityService.getTaskActivities(id);
      setActivities(activitiesData);
    } catch (err: any) {
      setError(err.message || 'Görev durumu güncellenirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !id) return;

    setSubmittingComment(true);
    try {
      const comment = await commentService.createComment({
        content: newComment,
        taskId: id
      });
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      
      const activitiesData = await activityService.getTaskActivities(id);
      setActivities(activitiesData);
    } catch (err: any) {
      setError(err.message || 'Yorum eklenirken bir hata oluştu.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo': return '#4A90E2';
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

  if (loading) {
    return <div className="task-detail-loading"><div className="loader"></div><p>Görev Yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="task-detail-error"><p>⚠️ {error}</p></div>;
  }

  if (!task) {
    return <div className="task-detail-error"><p>Görev bulunamadı.</p></div>;
  }

  return (
    <div className="task-detail-container">
      <header className="task-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Geri
        </button>
        <h1>{task.title}</h1>
      </header>
      
      <main className="task-detail-main">
        <div className="task-detail-grid">
          <div className="detail-card info-card">
            <h3 className="card-header">Görev Bilgileri</h3>
            <div className="task-info">
              <p><strong>Başlık:</strong> {task.title}</p>
              {task.description && <p><strong>Açıklama:</strong> {task.description}</p>}
            </div>
          </div>
          
          <div className="detail-card actions-card">
            <h3 className="card-header">Durum Güncelle</h3>
            <div className="current-status">
              <p><strong>Mevcut Durum:</strong> 
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusText(task.status)}
                </span>
              </p>
            </div>
            <div className="status-actions">
              <button
                onClick={() => handleStatusUpdate('TODO')}
                disabled={updating || task.status === 'TODO'}
                className={`status-button ${task.status === 'TODO' ? 'active' : ''}`}
              >
                Yapılacak
              </button>
              <button
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                disabled={updating || task.status === 'IN_PROGRESS'}
                className={`status-button ${task.status === 'IN_PROGRESS' ? 'active' : ''}`}
              >
                Yapılıyor
              </button>
              <button
                onClick={() => handleStatusUpdate('DONE')}
                disabled={updating || task.status === 'DONE'}
                className={`status-button ${task.status === 'DONE' ? 'active' : ''}`}
              >
                Tamamlandı
              </button>
              <button
                onClick={() => handleStatusUpdate('BLOCKED')}
                disabled={updating || task.status === 'BLOCKED'}
                className={`status-button ${task.status === 'BLOCKED' ? 'active' : ''}`}
              >
                Engellendi
              </button>
            </div>
            {updating && <p className="updating-message">Güncelleniyor...</p>}
          </div>

          <div className="detail-card comments-card">
            <h3 className="card-header">Yorumlar</h3>
            <div className="comment-form" style={{
              marginBottom: '2rem',
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                disabled={submittingComment}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  maxHeight: '120px',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  marginBottom: '1rem',
                  background: 'white',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2dcc70';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(45, 204, 112, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={submittingComment || !newComment.trim()}
                style={{
                  background: '#2dcc70',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!submittingComment && newComment.trim()) {
                    (e.target as HTMLButtonElement).style.background = '#27ae60';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#2dcc70';
                }}
              >
                {submittingComment ? 'Gönderiliyor...' : 'Yorum Ekle'}
              </button>
            </div>
            <div className="comments-list">
              {!comments || comments.length === 0 ? (
                <p className="no-comments">Henüz yorum yok.</p>
              ) : (
                comments.map((comment) => comment && (
                  <div key={comment.id} style={{
                    borderBottom: '1px solid #f1f3f4',
                    padding: '1rem 0',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#2d3748',
                        fontSize: '14px'
                      }}>
                        {comment.author?.firstName || 'Bilinmeyen'} {comment.author?.lastName || 'Kullanıcı'}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#718096',
                        fontStyle: 'italic'
                      }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div style={{
                      color: '#4a5568',
                      lineHeight: '1.5',
                      fontSize: '14px',
                      background: 'white',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="detail-card activities-card">
            <h3 className="card-header">Aktivite Geçmişi</h3>
            <div className="activities-list">
              {!activities || activities.length === 0 ? (
                <p className="no-activities">Henüz aktivite yok.</p>
              ) : (
                activities.map((activity) => activity && (
                  <div key={activity.id} style={{
                    borderBottom: '1px solid #f1f3f4',
                    padding: '0.75rem 0',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{
                        fontWeight: '700',
                        color: '#2dcc70',
                        fontSize: '15px',
                        marginRight: '0.5rem',
                        textTransform: 'uppercase'
                      }}>
                        {activity.user?.firstName || 'Bilinmeyen'} {activity.user?.lastName || 'Kullanıcı'}
                      </span>
                      <span style={{
                        color: '#1a202c',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {activity.description}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#718096',
                      fontStyle: 'italic'
                    }}>
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail; 