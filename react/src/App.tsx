import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Notification/ToastManager';
import { NotificationProvider } from './components/Notification/NotificationContext';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard'; 
import Projects from './components/Project/Projects';
import CreateProject from './components/Project/CreateProject';
import ProjectDetail from './components/Project/ProjectDetail';
import Tasks from './components/Tasks/Tasks';
import Users from './components/Users/Users';
import Settings from './components/Settings/Settings';
import TaskDetail from './components/Task/TaskDetail';
import AdminPanel from './components/Admin/AdminPanel';
import './App.scss';

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuth(!!token);
      setIsLoading(false);
    };

    checkAuth();

    const handleTokenChange = () => {
      checkAuth();
    };

    window.addEventListener('tokenChanged', handleTokenChange);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('tokenChanged', handleTokenChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  interface PrivateRouteProps {
    children: React.ReactNode;
  }

  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    if (isLoading) {
      return <div>Yükleniyor...</div>;
    }
    
    if (!isAuth) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <NotificationProvider>
      <ToastProvider>
        <Routes>
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/" replace /> : <Login />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </NotificationProvider>
  );
};

export default App;
