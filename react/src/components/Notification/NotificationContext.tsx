import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { notificationService, type Notification } from '../../api/notification.service';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: 'project' | 'task' | 'message' | 'system', title: string, message: string) => void;
  markNotificationAsRead: (notificationId: number) => void;
  unreadCount: number;
  loadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const loadNotifications = async () => {
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getUserNotifications(),
        notificationService.getUnreadCount()
      ]);
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const addNotification = (type: 'project' | 'task' | 'message' | 'system', title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      type: type === 'project' ? 'PROJECT_ASSIGNED' : 
            type === 'task' ? 'TASK_ASSIGNED' : 
            type === 'message' ? 'SYSTEM_ANNOUNCEMENT' : 'SYSTEM_ANNOUNCEMENT',
      title,
      message,
      status: 'UNREAD',
      createdAt: new Date().toISOString(),
      data: {}
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, status: 'READ' as const } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken hata:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markNotificationAsRead,
      unreadCount,
      loadNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 