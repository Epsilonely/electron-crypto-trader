import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...notification
    }, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  };

  return {
    notifications,
    addNotification,
    clearNotifications,
    removeNotification
  };
}; 