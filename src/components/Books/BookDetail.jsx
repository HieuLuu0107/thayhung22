import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Rating,
  Stack,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  BookmarkBorder,
  MenuBook,
  Category as CategoryIcon,
  Person,
  DeleteOutline,
  Speed,
  LibraryAdd,
  Bookmark,
  Login,
  BookmarkAdd,
  Warning,
} from '@mui/icons-material';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useNotification } from '../../contexts/NotificationContext';

const gradientButtons = {
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .5)',
  }
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const { refreshNotifications } = useNotification();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowStatus, setBorrowStatus] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, content: '' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [canReserve, setCanReserve] = useState(false);

  const fetchBookDetails = React.useCallback(async () => {
    try {
      const response = await api.get(`/v1/open/books/${id}`);
      if (response.data) {
        setBook(response.data);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Không thể tải thông tin sách');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkBorrowStatus = React.useCallback(async () => {
    try {
      const response = await api.get('/v1/user/borrows');
      const borrowed = response.data.find(borrow => 
        borrow.book_id === parseInt(id) && 
        ['pending', 'borrowed'].includes(borrow.status)
      );
      setBorrowStatus(borrowed);
    } catch (error) {
      console.error('Error checking borrow status:', error);
    }
  }, [id]);

  const checkReservePermission = React.useCallback(async () => {
    try {
      const response = await api.get('/v1/user/profile');
      const subscription = response.data?.subscription;
      
      // Kiểm tra chi tiết hơn về subscription và quyền đặt trước
      setCanReserve(
        subscription && 
        subscription.status === 'active' && 
        subscription.package?.can_reserve && 
        new Date(subscription.end_date) > new Date()
      );
      
      console.log('Reserve permission:', {
        hasSubscription: !!subscription,
        status: subscription?.status,
        canReserve: subscription?.package?.can_reserve,
        endDate: subscription?.end_date
      });
      
    } catch (error) {
      console.error('Error checking reserve permission:', error);
      setCanReserve(false);
    }
  }, []);

  const borrowBook = async () => {
    try {
      const response = await api.post('/v1/borrows', { 
        book_id: parseInt(id)
      });
      
      toast.success('Mượn sách thành công!');
      checkBorrowStatus();
      setOpenConfirmDialog(false);
      
      navigate('/borrows', { 
        state: { 
          refresh: true,
          message: 'Mượn sách thành công!' 
        } 
      });
      
    } catch (error) {
      if (error.response?.status === 403) {
        if (error.response.data?.code === 'NO_SUBSCRIPTION') {
          toast.error('Bạn cần có gói thành viên để mượn sách');
        } else if (error.response.data?.code === 'MAX_BORROWS_REACHED') {
          toast.error('Bạn đã đạt giới hạn số sách được mượn');
        }
      } else {
        toast.error('Có lỗi xảy ra khi mượn sách');
      }
      setOpenConfirmDialog(false);
    }
  };

  const handleBorrowClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setOpenConfirmDialog(true);
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/v1/books/${id}/reserve`);
      
      toast.success('Đặt trước sách thành công');
      fetchBookDetails();
      
      navigate('/borrows', { 
        state: { 
          refresh: true,
          message: 'Đặt trước sách thành công!' 
        } 
      });

    } catch (error) {
      console.error('Reserve error:', error.response?.data);
      
      if (error.response?.status === 403) {
        toast.error('Bạn cần nâng cấp lên gói Premium để đặt trước sách');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Không thể đặt trước sách này');
      } else {
        toast.error('Có lỗi xảy ra khi đặt trước sách');
      }
    }
  };

  const fetchReviews = React.useCallback(async () => {
    try {
      const response = await api.get(`/v1/books/${id}/reviews`);
      if (response.data?.data) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [id]);

  const handleReviewSubmit = async () => {
    try {
      await api.post('/v1/reviews', {
        book_id: id,
        rating: userReview.rating,
        content: userReview.content
      });
      fetchReviews();
      setUserReview({ rating: 0, content: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/v1/reviews/${reviewId}`);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  useEffect(() => {
    fetchBookDetails();
    if (isAuthenticated) {
      checkBorrowStatus();
      checkReservePermission();
    }
    fetchReviews();
  }, [id, isAuthenticated, fetchBookDetails, checkBorrowStatus, checkReservePermission, fetchReviews]);

  const renderActionButton = () => {
    if (!isAuthenticated) {
      return (
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          startIcon={<Login />}
          fullWidth
        >
          Đăng nhập để mượn sách
        </Button>
      );
    }

    // Nếu đang mượn sách này
    if (borrowStatus) {
      return (
        <Button
          variant="contained"
          color="primary"
          disabled
          fullWidth
        >
          Đang mượn sách này
        </Button>
      );
    }

    // Sửa lại logic kiểm tra số lượng sách
    if (book.quantity > 0) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleBorrowClick}
          startIcon={<BookmarkAdd />}
          fullWidth
        >
          Mượn sách
        </Button>
      );
    }

    // Nếu hết sách và có quyền đặt trước
    if (canReserve) {
      return (
        <Stack spacing={2} width="100%">
          <Button
            variant="outlined"
            color="error"
            startIcon={<Warning />}
            disabled
            fullWidth
          >
            Hết sách
          </Button>
          <Button
            variant="contained"
            onClick={handleReserve}
            startIcon={<Bookmark />}
            fullWidth
          >
            Đặt trước
          </Button>
        </Stack>
      );
    }

    // Nếu hết sách và không có quyền đặt trước
    return (
      <Stack spacing={2} width="100%">
        <Button
          variant="outlined"
          color="error"
          startIcon={<Warning />}
          disabled
          fullWidth
        >
          Hết sách
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/pricing')}
          fullWidth
        >
          Nâng cấp để đặt trước
        </Button>
      </Stack>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ 
        py: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #fff 100%)',
        minHeight: '100vh'
      }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
            <Grid container spacing={4}>
              {/* Book Image */}
              <Grid item xs={12} md={4}>
                <Box
                  component="img"
                  src={`/images/${book?.image}`}
                  alt={book?.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </Grid>

              {/* Book Info */}
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #4F46E5 30%, #EC4899 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {book?.title}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Chip
                    icon={<CategoryIcon />}
                    label={book?.category?.name}
                    sx={{ bgcolor: '#4F46E5', color: 'white' }}
                  />
                  <Chip
                    icon={<Person />}
                    label={book?.author}
                    variant="outlined"
                  />
                  {book?.quantity > 0 ? (
                    <Chip
                      label={`Còn ${book?.quantity} cuốn`}
                      color="success"
                    />
                  ) : (
                    <Chip
                      label="Hết sách"
                      color="error"
                    />
                  )}
                </Stack>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {book?.description}
                </Typography>

               

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  {renderActionButton()}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Đánh giá & Bình luận
            </Typography>

            {isAuthenticated ? (
              <Card sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Viết đánh giá của bạn
                  </Typography>
                  <Rating
                    value={userReview.rating}
                    onChange={(_, value) => setUserReview(prev => ({ ...prev, rating: value }))}
                    size="large"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={userReview.content}
                    onChange={(e) => setUserReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách..."
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleReviewSubmit}
                    disabled={!userReview.rating}
                    sx={{
                      ...gradientButtons.primary,
                      transition: 'all 0.2s',
                    }}
                  >
                    Gửi đánh giá
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info" sx={{ mb: 4 }}>
                Vui lòng <Button color="primary" onClick={() => navigate('/login')}>đăng nhập</Button> để viết đánh giá
              </Alert>
            )}

            <List>
              {reviews.map((review) => (
                <React.Fragment key={review.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      review.user_id === user?.id && (
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteReview(review.id)}
                          size="small"
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>{review.user.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {review.user.name}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          color="text.primary" 
                          sx={{ my: 1 }}
                        >
                          {review.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Container>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '350px'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          py: 2
        }}>
          Xác nhận mượn sách
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn mượn sách "{book?.title}" không?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpenConfirmDialog(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              minWidth: '100px' 
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={borrowBook}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: '100px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
              }
            }}
            autoFocus
          >
            Mượn sách
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookDetail; 