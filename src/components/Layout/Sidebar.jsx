import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Button,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
} from '@mui/material';
import {
  MenuBook,
  Search,
  History,
  BookmarkBorder,
  Person,
  Notifications,
  Login as LoginIcon,
  CardMembership,
  ExitToApp,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const isAuthenticated = !!token;
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Trang chủ', icon: <MenuBook />, path: '/' },
    { text: 'Tìm sách', icon: <Search />, path: '/books' },
    ...(isAuthenticated ? [
      { text: 'Sách đã mượn', icon: <History />, path: '/borrows' },
      { text: 'Đặt trước', icon: <BookmarkBorder />, path: '/reservations' },
      { text: 'Gói thành viên', icon: <CardMembership />, path: '/membership' },
    ] : [])
  ];

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logout()).unwrap();
      setLogoutDialogOpen(false);
      setAnchorEl(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#fff',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        width: 280,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2A2F4F' }}>
          Thư Viện Online
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <Stack spacing={0.5} sx={{ p: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <Button
            key={item.path}
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              borderRadius: 2,
              color: location.pathname === item.path ? '#fff' : '#2A2F4F',
              backgroundColor: location.pathname === item.path ? '#2A2F4F' : 'transparent',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? '#2A2F4F' : 'rgba(42, 47, 79, 0.08)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                ml: 1,
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            >
              {item.text}
            </Typography>
          </Button>
        ))}
      </Stack>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <IconButton 
              onClick={handleMenu}
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <Avatar 
                src={user?.avatar}
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: '#E8A0BF',
                  color: '#2A2F4F',
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: -1,
                  minWidth: 180,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  handleClose();
                  navigate('/profile');
                }}
                sx={{ py: 1.5 }}
              >
                <Person sx={{ mr: 2, color: '#2A2F4F' }} />
                <Typography>Hồ sơ</Typography>
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={() => {
                  handleClose();
                  setLogoutDialogOpen(true);
                }}
                sx={{ py: 1.5, color: '#d32f2f' }}
              >
                <ExitToApp sx={{ mr: 2 }} />
                <Typography>Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: '#2A2F4F',
              '&:hover': {
                bgcolor: '#1A1F3F',
              },
            }}
          >
            Đăng nhập
          </Button>
        )}
      </Box>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => setLogoutDialogOpen(false)}
            sx={{ color: '#2A2F4F' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            sx={{ px: 3 }}
          >
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar; 