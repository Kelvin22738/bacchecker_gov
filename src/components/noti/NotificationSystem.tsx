// src/components/notifications/NotificationSystem.tsx - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Eye,
  FileText,
  User,
  Calendar,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VerificationWorkflowAPI } from '../../utils/verificationWorkflowAPI';
import { Notification } from '../../types/verification';

export function NotificationSystem() {
  const { state } = useAuth();
  const { user } = state;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load notifications from Supabase
  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get notifications for this user
      const userNotifications = await VerificationWorkflowAPI.getUserNotifications(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await VerificationWorkflowAPI.markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      // Mark all unread notifications as read
      await Promise.all(
        unreadNotifications.map(n => VerificationWorkflowAPI.markNotificationAsRead(n.id))
      );
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Check for new verification status updates
  const checkForUpdates = async () => {
    if (!user) return;

    try {
      // Check for requests that need attention based on user role
      if (user.role === 'gtec_admin' || user.role === 'bacchecker_admin') {
        const gtecRequests = await VerificationWorkflowAPI.getGTECRequests();
        const pendingCount = gtecRequests.filter(r => 
          r.overall_status === 'submitted' || r.overall_status === 'institution_approved'
        ).length;

        // Auto-create notification if there are pending requests and no recent notification exists
        if (pendingCount > 0) {
          const recentNotifications = notifications.filter(n => 
            n.title.includes('verification requests pending') && 
            new Date(n.created_at).getTime() > Date.now() - (30 * 60 * 1000) // Last 30 minutes
          );

          if (recentNotifications.length === 0) {
            await VerificationWorkflowAPI.createNotification({
              user_id: user.id,
              type: 'info',
              title: 'Verification Requests Pending',
              message: `You have ${pendingCount} verification request(s) that require your attention.`,
              action_url: '/admin/verification',
              action_label: 'Review Requests'
            });
            
            // Reload notifications
            loadNotifications();
          }
        }
      } else if (user.role === 'tertiary_institution_user' && user.institutionId) {
        const institutionRequests = await VerificationWorkflowAPI.getInstitutionRequests(user.institutionId);
        const pendingCount = institutionRequests.filter(r => r.overall_status === 'gtec_approved').length;

        if (pendingCount > 0) {
          const recentNotifications = notifications.filter(n => 
            n.title.includes('verification requests forwarded') && 
            new Date(n.created_at).getTime() > Date.now() - (30 * 60 * 1000) // Last 30 minutes
          );

          if (recentNotifications.length === 0) {
            await VerificationWorkflowAPI.createNotification({
              user_id: user.id,
              type: 'warning',
              title: 'Verification Requests Forwarded',
              message: `GTEC has forwarded ${pendingCount} verification request(s) to your institution.`,
              action_url: '/verification',
              action_label: 'Process Requests'
            });
            
            // Reload notifications
            loadNotifications();
          }
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();

      // Check for updates every 2 minutes
      const interval = setInterval(() => {
        checkForUpdates();
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [user?.id]);

  // Reload notifications when dropdown opens
  useEffect(() => {
    if (showDropdown && user) {
      loadNotifications();
    }
  }, [showDropdown, user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.action_url) {
      window.location.href = notification.action_url;
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowDropdown(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400">You'll see updates about your verification requests here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(notification.created_at)}
                              </span>
                              
                              {notification.action_label && (
                                <span className="text-xs text-blue-600 font-medium">
                                  {notification.action_label} →
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <Button variant="ghost" size="sm" className="text-sm" onClick={loadNotifications}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh notifications
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

// Hook to add notifications from other components
export function useNotifications() {
  const { state } = useAuth();
  const { user } = state;

  const addNotification = async (notification: {
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    action_url?: string;
    action_label?: string;
    request_id?: string;
  }) => {
    if (!user) return;

    try {
      await VerificationWorkflowAPI.createNotification({
        user_id: user.id,
        ...notification
      });
      
      // Trigger a custom event to update the notification component
      window.dispatchEvent(new CustomEvent('notificationAdded'));
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return { addNotification };
}