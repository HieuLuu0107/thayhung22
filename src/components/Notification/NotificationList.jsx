import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import api from '../../api/axios';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/v1/notifications');
      // Đảm bảo response.data là array
      const notificationList = Array.isArray(response.data) ? response.data : [];
      setNotifications(notificationList);
      // Đếm số thông báo chưa đọc
      setUnreadCount(notificationList.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notification) => {
    try {
      await api.patch(`/v1/notifications/${notification.id}/read`);
      // Cập nhật state locally thay vì gọi API lại
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? {...n, read_at: new Date().toISOString()} : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling mỗi 30 giây
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography>Không có thông báo mới</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleMarkAsRead(notification)}
              sx={{
                whiteSpace: 'normal',
                backgroundColor: notification.read_at ? 'inherit' : 'action.hover',
              }}
            >
              <Box>
                <Typography variant="subtitle2">
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.created_at).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationList; 