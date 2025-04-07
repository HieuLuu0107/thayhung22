import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
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
  Stack,
  Container,
  Divider,
} from '@mui/material';
import {
  MenuBook,
  Search,
  History,
  BookmarkBorder,
  Person,
  Login as LoginIcon,
  CardMembership,
  ExitToApp,
  LocalLibrary,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import NotificationList from '../Notification/NotificationList';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

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
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: '70px',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalLibrary sx={{ color: '#fff', fontSize: 32 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.5px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              }}
              onClick={() => navigate('/')}
            >
              Thư Viện Online
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flex: 1,
              justifyContent: 'center',
              '& .MuiButton-root': {
                minWidth: 'auto',
                px: 2,
                py: 1,
                borderRadius: 2,
                color: 'rgba(255,255,255,0.85)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                },
              }
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'transparent',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              >
                {item.text}
              </Button>
            ))}
          </Stack>

          {/* User Profile & Notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated && <NotificationList />}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenu}>
                  <Avatar 
                    src={user?.avatar}
                    sx={{ 
                      width: 40,
                      height: 40,
                      bgcolor: '#fff',
                      color: '#764ba2',
                      border: '2px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #fff 0%, #f5f7fa 100%)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.08)',
                        }
                      },
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Xin chào,
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user?.name}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/profile');
                  }}>
                    <Person sx={{ mr: 2, color: '#2A2F4F' }} />
                    Hồ sơ
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleClose();
                      setLogoutDialogOpen(true);
                    }}
                    sx={{ color: '#d32f2f' }}
                  >
                    <ExitToApp sx={{ mr: 2 }} />
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)',
                  color: '#764ba2',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  '&:hover': {
                    background: '#fff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            background: 'linear-gradient(135deg, #fff 0%, #f5f7fa 100%)',
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
            sx={{ 
              color: '#2A2F4F',
              '&:hover': { bgcolor: 'rgba(42, 47, 79, 0.08)' },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            sx={{ 
              px: 3,
              '&:hover': { transform: 'translateY(-1px)' },
              transition: 'transform 0.2s',
            }}
          >
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar; 