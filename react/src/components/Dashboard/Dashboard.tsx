import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss'; 
import { userService } from '../../api/user.service';
import { projectService } from '../../api/project.service';
import { taskService } from '../../api/task.service';
import type { Project, Task } from '../../types';

// Chart.js eklemeleri
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [tasksCount, setTasksCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Görev durumlarını hesapla (backend'den gelen verilerle)
  const completed = useMemo(
    () => userTasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length,
    [userTasks]
  );
  const inProgress = useMemo(
    () => userTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DEVAM_EDEN').length,
    [userTasks]
  );

  const doughnutChartData = {
    labels: ['Tamamlanan Görevler', 'Devam Eden Görevler'],
    datasets: [
      {
        label: 'Görevler',
        data: [completed, inProgress],
        backgroundColor: [
          'rgba(76, 110, 245, 0.85)',
          'rgba(72, 198, 239, 0.7)',
        ],
        borderColor: [
          'rgba(76, 110, 245, 1)',
          'rgba(72, 198, 239, 1)',
        ],
        borderWidth: 2,
        cutout: '70%',
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: {
        display: true,
        text: 'Görev Dağılımı',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed} adet`;
          }
        }
      }
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUserProfile = await userService.getProfile();
        setUser(currentUserProfile);

        if (currentUserProfile.role === 'ADMIN') {
          const [allUsers, allProjects, allTasks] = await Promise.all([
            userService.getUsers(),
            projectService.getProjects(),
            taskService.getAllTasks()
          ]);
          setUsersCount(allUsers.length);
          setProjectsCount(allProjects.length);
          setTasksCount(allTasks.length);
          setUserProjects(allProjects);
          setUserTasks(allTasks);
        } else {
          const [projects, tasks] = await Promise.all([
            projectService.getProjects(),
            taskService.getAllTasks()
          ]);
          setUserProjects(projects);
          setProjectsCount(projects.length);
          setUserTasks(tasks);
          setTasksCount(tasks.length);
        }
      } catch (err: any) {
        console.error('Dashboard verileri çekilirken hata oluştu:', err);
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('tokenChanged'));
          return;
        }
        setError('Veriler yüklenirken bir sorun oluştu.');
        setProjectsCount(0);
        setTasksCount(0);
        setUsersCount(0);
        setUserProjects([]);
        setUserTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-message">
        <p>Veriler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-message error">
        <p>{error}</p>
        <p>Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Hoş Geldiniz, {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}!</h1>
      
      <div className="chart-area" style={{ position: "relative" }}>
        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: 700,
          fontSize: 22,
          color: "#6c63ff"
        }}>
          {completed + inProgress} <span style={{fontSize: 13, color: "#6b7a99"}}>görev</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>{user?.role === 'ADMIN' ? 'Toplam Projeler' : 'Projelerim'}</h3>
          <div className="stat-value">{projectsCount ?? 'N/A'}</div>
        </div>
        <div className="stat-card">
          <h3>{user?.role === 'ADMIN' ? 'Toplam Görevler' : 'Görevlerim'}</h3>
          <div className="stat-value">{tasksCount ?? 'N/A'}</div>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="stat-card">
            <h3>Toplam Kullanıcılar</h3>
            <div className="stat-value">{usersCount ?? 'N/A'}</div>
          </div>
        )}
      </div>

      {user?.role === 'ADMIN' ? (
        <div className="admin-dashboard">
          <h2>Yönetici Paneli</h2>
          <p>Sistem genelinde tüm projeleri ve kullanıcıları yönetebilirsiniz.</p>
        </div>
      ) : (
        <div className="user-dashboard">
          <h2>Projelerim</h2>
          {userProjects.length > 0 ? (
            <div className="projects-summary">
              {userProjects.slice(0, 3).map(project => (
                <div key={project.id} className="project-summary-card">
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  <div className="project-tasks">
                    <small>Görevler: {project.tasks?.length || 0}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Henüz bir projeye atanmamışsınız.</p>
          )}

          <h2>Görevlerim</h2>
          {userTasks.length > 0 ? (
            <div className="tasks-summary">
              {userTasks.slice(0, 5).map(task => (
                <div key={task.id} className="task-summary-card">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <span className={`task-status status-${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Henüz size atanmış bir görev bulunmuyor.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;