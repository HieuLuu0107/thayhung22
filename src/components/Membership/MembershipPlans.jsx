import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Check, Speed } from '@mui/icons-material';
import LoadingSpinner from '../common/LoadingSpinner';

const MembershipPlans = () => {
  const [packages, setPackages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [upgradeInfo, setUpgradeInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [packagesResponse, currentResponse] = await Promise.all([
        api.get('/v1/open/packages'),
        api.get('/v1/subscription/current')
      ]);

      if (packagesResponse.data) {
        setPackages(packagesResponse.data);
      }

      if (currentResponse.data) {
        setCurrentPlan(currentResponse.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status !== 404) {
        setError('Không thể tải thông tin gói thành viên');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  const confirmSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.post('/v1/subscription/subscribe', {
        package_id: selectedPlan.id,
        payment_method: paymentMethod
      });
      
      if (response.data.upgrade_info) {
        setUpgradeInfo(response.data.upgrade_info);
      }
      
      setNotification({
        open: true,
        message: response.data.message,
        severity: 'success'
      });
      
      await fetchData();
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Subscription error:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Đăng ký gói thất bại. Vui lòng thử lại',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {notification.open && (
          <Alert 
            severity={notification.severity}
            sx={{ 
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
              boxShadow: 1,
              '& .MuiAlert-message': { flex: 1 }
            }}
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          >
            {notification.message}
          </Alert>
        )}

        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Gói Thành Viên
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Chọn gói phù hợp với nhu cầu của bạn
          </Typography>
        </Box>

        {currentPlan && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              boxShadow: 1,
              borderRadius: 2,
              '& .MuiAlert-message': { flex: 1 }
            }}
            icon={<Speed />}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Gói hiện tại:{' '}
              <Typography component="span" color="primary" fontWeight="bold">
                {currentPlan.package?.name || ''}
              </Typography>
              {currentPlan.end_date && (
                <Typography component="span" color="text.secondary">
                  {' '}- Hết hạn: {new Date(currentPlan.end_date).toLocaleDateString('vi-VN')}
                </Typography>
              )}
            </Typography>
          </Alert>
        )}

        <Grid container spacing={4} justifyContent="center">
          {packages && packages.length > 0 ? (
            packages.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: plan.color || 'primary.main'
                      }}
                    >
                      {plan.name}
                    </Typography>

                    <Box sx={{ my: 4 }}>
                      <Typography
                        variant="h3"
                        component="span"
                        sx={{ 
                          fontWeight: 700,
                          color: plan.color || 'primary.main'
                        }}
                      >
                        {new Intl.NumberFormat('vi-VN').format(plan.price)}đ
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{ color: 'text.secondary', ml: 1 }}
                      >
                        /{plan.duration} tháng
                      </Typography>
                    </Box>

                    <List sx={{ mb: 4 }}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Check sx={{ color: plan.color || 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Mượn tối đa ${plan.max_borrows} cuốn sách`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Check sx={{ color: plan.color || 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Thời gian mượn ${plan.borrow_duration} ngày`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      {plan.can_reserve && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Check sx={{ color: plan.color || 'primary.main' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Đặt trước sách"
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      )}
                    </List>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => handleSubscribe(plan)}
                      sx={{
                        py: 1.5,
                        bgcolor: plan.color || 'primary.main',
                        '&:hover': {
                          bgcolor: plan.color ? `${plan.color}CC` : 'primary.dark',
                        },
                        borderRadius: 2,
                        boxShadow: 2,
                      }}
                    >
                      Đăng ký ngay
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Không có gói thành viên nào
            </Typography>
          )}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Xác nhận đăng ký gói</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Typography gutterBottom>
              Bạn có chắc chắn muốn đăng ký {selectedPlan?.name || ''} với giá{' '}
              {new Intl.NumberFormat('vi-VN').format(selectedPlan?.price)}đ/{selectedPlan?.duration} tháng?
            </Typography>
            
            {upgradeInfo && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Thông tin nâng cấp từ gói {upgradeInfo.previous_package}:
                </Typography>
                <Typography>
                  Giá trị còn lại: {new Intl.NumberFormat('vi-VN').format(upgradeInfo.remaining_value)}đ
                </Typography>
                <Typography>
                  Phí nâng cấp: {new Intl.NumberFormat('vi-VN').format(upgradeInfo.upgrade_fee)}đ
                </Typography>
              </Box>
            )}

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="cash">Tiền mặt</MenuItem>
                <MenuItem value="transfer">Chuyển khoản</MenuItem>
                <MenuItem value="card">Thẻ tín dụng</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button onClick={confirmSubscription} variant="contained" color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MembershipPlans; 