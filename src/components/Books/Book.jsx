import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Card, CardActions, Button, Stack } from '@mui/material';
import { Login, BookmarkAdd, Bookmark, Warning } from '@mui/icons-material';
import Notification from '../Notification';
import { useNotification } from '../../contexts/NotificationContext';
import { toast } from 'react-hot-toast';

const Book = ({ book }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshNotifications } = useNotification();

  const handleBorrow = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/books/borrow', {
        book_id: book.id
      });
      
      if (response.status === 201) {
        toast.success('Mượn sách thành công');
        navigate('/borrows', { 
          state: { 
            refresh: true,
            message: 'Mượn sách thành công' 
          }
        });
      }
    } catch (error) {
      console.error('Borrow error:', error.response?.data);
      if (error.response?.status === 403) {
        toast.error('Bạn cần nâng cấp lên gói Premium để mượn sách');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Không thể mượn sách này');
      } else {
        toast.error('Có lỗi xảy ra khi mượn sách');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/api/v1/books/${book.id}/reserve`);
      
      if (response.status === 201) {
        toast.success('Đặt trước sách thành công');
        navigate('/borrows', {
          state: {
            refresh: true,
            message: 'Đặt trước sách thành công'
          }
        });
      }
    } catch (error) {
      console.error('Reserve error:', error.response?.data);
      if (error.response?.status === 403) {
        toast.error('Bạn cần nâng cấp lên gói Premium để đặt trước sách');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Không thể đặt trước sách này');
      } else {
        toast.error('Có lỗi xảy ra khi đặt trước sách');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => {
    if (!user) {
      return (
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          startIcon={<Login />}
        >
          Đăng nhập để mượn sách
        </Button>
      );
    }

    if (book.quantity > 0) {
      return (
        <Button
          variant="contained"
          onClick={handleBorrow}
          startIcon={<BookmarkAdd />}
          disabled={loading}
        >
          Mượn sách
        </Button>
      );
    }

    return (
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Warning />}
          disabled
        >
          Hết sách
        </Button>
        <Button
          variant="contained"
          onClick={handleReserve}
          startIcon={<Bookmark />}
          disabled={loading}
        >
          Đặt trước
        </Button>
      </Stack>
    );
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Card content... */}
      <CardActions sx={{ mt: 'auto', p: 2 }}>
        {renderButton()}
      </CardActions>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Card>
  );
};

export default Book; 