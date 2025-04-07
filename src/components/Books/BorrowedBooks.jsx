import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Container,
  CardMedia,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import { CalendarToday, Book, Timer } from '@mui/icons-material';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import Notification from '../common/Notification';
import { useLocation } from 'react-router-dom';

const BorrowedBooks = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const location = useLocation();

  useEffect(() => {
    fetchBorrows();
    
    if (location.state?.message) {
      setNotification({
        open: true,
        message: location.state.message,
        severity: 'success',
      });
      
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/user/borrows');
      setBorrows(response.data);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Không thể tải danh sách sách đã mượn',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'borrowed':
        return 'Đang mượn';
      case 'returned':
        return 'Đã trả';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={8}>
        <Box mb={6} textAlign="center">
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Sách Đã Mượn
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
          >
            Quản lý và theo dõi các sách bạn đã mượn từ thư viện
          </Typography>
        </Box>
        
        {loading ? (
          <LoadingSpinner open={loading} />
        ) : (
          <Grid container spacing={4}>
            {borrows.map((borrow) => (
              <Grid item xs={12} md={6} key={borrow.id}>
                <Paper 
                  elevation={3}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
                    },
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Card sx={{ display: 'flex', height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: 160,
                        objectFit: 'cover',
                        borderRight: '1px solid #eee'
                      }}
                      image={`/images/${borrow.book.image}` || '/default-book.jpg'}
                      alt={borrow.book.title}
                    />
                    <CardContent 
                      sx={{ 
                        flex: 1,
                        p: 3,
                        '&:last-child': { pb: 3 }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: '#1976d2',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        {borrow.book.title}
                      </Typography>

                      <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <CalendarToday sx={{ color: 'primary.main' }} />
                          <Typography>
                            Ngày mượn: {new Date(borrow.borrow_date).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Timer sx={{ color: 'primary.main' }} />
                          <Typography>
                            Hạn trả: {new Date(borrow.due_date).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Book sx={{ color: 'primary.main' }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>Trạng thái:</Typography>
                            <Chip
                              label={getStatusLabel(borrow.status)}
                              color={getStatusColor(borrow.status)}
                              size="small"
                              sx={{ 
                                fontWeight: 500,
                                px: 1
                              }}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            ))}

            {borrows.length === 0 && (
              <Box 
                sx={{ 
                  width: '100%', 
                  textAlign: 'center',
                  py: 12,
                  px: 3,
                  background: '#f5f5f5',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Bạn chưa mượn sách nào
                </Typography>
                <Typography color="text.secondary">
                  Hãy khám phá thư viện và mượn những cuốn sách yêu thích
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Box>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
};

export default BorrowedBooks; 