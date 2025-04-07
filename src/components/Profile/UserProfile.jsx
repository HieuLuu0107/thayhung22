import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Person, Email, Badge } from '@mui/icons-material';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import Notification from '../common/Notification';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/v1/user/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/v1/user/profile', formData);
      setProfile(prev => ({
        ...prev,
        user: response.data
      }));
      setEditMode(false);
      setNotification({
        open: true,
        message: 'Cập nhật thông tin thành công',
        severity: 'success',
      });
    } catch (error) {
      setError('Không thể cập nhật thông tin');
      setNotification({
        open: true,
        message: 'Cập nhật thông tin thất bại',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="column" alignItems="center" spacing={3} mb={4}>
            <Avatar
              src={profile?.user?.avatar}
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {profile?.user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Thông tin cá nhân
            </Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />
          
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ tên"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button type="submit" variant="contained" color="primary">
                      Lưu thay đổi
                    </Button>
                    <Button onClick={() => setEditMode(false)} color="inherit">
                      Hủy
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Họ tên
                    </Typography>
                    <TextField
                      fullWidth
                      value={profile.user.name}
                      disabled
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.paper',
                          '&:hover': {
                            '& > fieldset': { borderColor: 'primary.main' }
                          }
                        }
                      }}
                    />
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      value={profile.user.email}
                      disabled
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#f5f5f5'
                        }
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Badge sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Vai trò
                    </Typography>
                    <TextField
                      fullWidth
                      value={profile.user.is_admin ? 'Quản trị viên' : 'Người dùng'}
                      disabled
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#f5f5f5'
                        }
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />
              
              {/* Thông tin gói thành viên */}
              <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                Thông tin gói thành viên
              </Typography>

              {profile?.subscription ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gói hiện tại
                      </Typography>
                      <TextField
                        fullWidth
                        value={profile.subscription.package.name}
                        disabled
                        variant="outlined"
                      />
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ngày hết hạn
                      </Typography>
                      <TextField
                        fullWidth
                        value={new Date(profile.subscription.end_date).toLocaleDateString('vi-VN')}
                        disabled
                        variant="outlined"
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Quyền lợi của bạn:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 2 }}>
                        <li>Mượn tối đa {profile.subscription.package.max_books} cuốn sách</li>
                        <li>Thời gian mượn {profile.subscription.package.loan_duration} ngày</li>
                        {profile.subscription.package.can_reserve && (
                          <li>Có thể đặt trước sách</li>
                        )}
                        {profile.subscription.package.priority_reservation && (
                          <li>Ưu tiên khi đặt trước</li>
                        )}
                        {profile.subscription.package.delivery && (
                          <li>Giao sách tận nơi</li>
                        )}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/membership')}
                      sx={{ mt: 3 }}
                    >
                      Nâng cấp gói thành viên
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Bạn chưa đăng ký gói thành viên nào
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/membership')}
                  >
                    Đăng ký ngay
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 4 }} />

              {/* Update Profile Button */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                >
                  Chỉnh sửa thông tin
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
};

export default UserProfile; 