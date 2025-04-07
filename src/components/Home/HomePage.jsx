import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
} from '@mui/material';
import {
  LibraryBooks,
  MenuBook,
  Speed,
  ArrowForward,
} from '@mui/icons-material';
import api from '../../api/axios';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const [featuredResponse, newResponse] = await Promise.all([
        api.get('/v1/open/books/featured'),
        api.get('/v1/open/books/new')
      ]);

      // Log responses để debug
      console.log('Featured response:', featuredResponse);
      console.log('New response:', newResponse);

      if (featuredResponse.data) {
        setFeaturedBooks(featuredResponse.data.data || []);
      }
      if (newResponse.data) {
        setNewBooks(newResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError(error.message);
      // Log error details
      if (error.response) {
        console.log('Error response:', error.response.data);
      }
    }
  };

  const features = [
    {
      icon: <LibraryBooks sx={{ fontSize: 60 }} />,
      title: 'Kho Sách Đa Dạng',
      description: 'Hàng nghìn đầu sách từ nhiều thể loại khác nhau'
    },
    {
      icon: <Speed sx={{ fontSize: 60 }} />,
      title: 'Mượn Sách Dễ Dàng',
      description: 'Quy trình mượn sách đơn giản, nhanh chóng'
    },
    {
      icon: <MenuBook sx={{ fontSize: 60 }} />,
      title: 'Đọc Mọi Lúc Mọi Nơi',
      description: 'Truy cập 24/7 từ mọi thiết bị'
    }
  ];

  const BookSection = ({ title, books }) => (
    <Box sx={{ mt: 8 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {title}
        </Typography>
        <Button
          endIcon={<ArrowForward />}
          onClick={() => navigate('/books')}
          sx={{
            color: '#4F46E5',
            '&:hover': { 
              color: '#EC4899',
              transform: 'translateX(4px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Xem tất cả
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={3} key={book.id}>
            <Card 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardMedia
                component="img"
                image={`/images/${book.image}`}
                alt={book.title}
                sx={{
                  height: 200,
                  objectFit: 'contain',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'primary.main',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {book.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {book.author}
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    label={book.category.name}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(124, 58, 237, 0.1)',
                      color: '#7C3AED',
                    }}
                  />
                  <Chip
                    label={`${book.quantity} cuốn`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(236, 72, 153, 0.1)',
                      color: '#EC4899',
                    }}
                  />
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/books/${book.id}`)}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 60%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(42, 47, 79, 0.2)',
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  Chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#F8FAFC' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/pattern.svg) repeat',
            opacity: 0.1,
            animation: 'move 20s linear infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          },
          '@keyframes move': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '100% 100%' },
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                sx={{
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                Thư Viện Online
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.95,
                  lineHeight: 1.6,
                  fontWeight: 500,
                  color: '#FDE5EC',
                }}
              >
                {isAuthenticated && user 
                  ? `Chào mừng ${user.name} đến với thư viện của chúng tôi`
                  : 'Khám phá kho tàng tri thức không giới hạn'}
              </Typography>
              
              {isAuthenticated && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/books')}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #E8A0BF 30%, #FDE5EC 90%)',
                    color: '#2A2F4F',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FDE5EC 30%, #E8A0BF 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  Khám Phá Ngay
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://watermark.lovepik.com/photo/40112/9310.jpg_wh1200.jpg"
                alt="Library"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  display: 'block',
                  margin: 'auto',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container 
        sx={{ 
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1,
          mt: -6,
        }}
      >
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  p: 4,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(231,227,252,0.5)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(42,47,79,0.12)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(253,229,236,0.2) 100%)',
                  }
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      mb: 3,
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease',
                      '& svg': {
                        color: '#917FB3',
                        transition: 'all 0.3s ease',
                      },
                      '&:hover': { 
                        transform: 'scale(1.1)',
                        '& svg': {
                          color: '#2A2F4F',
                        }
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: '#2A2F4F',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#917FB3'
                      }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      color: '#666',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#2A2F4F'
                      }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* New Books Section */}
      <Container maxWidth="xl">
        <BookSection
          title="Sách Mới"
          books={newBooks}
        />
        
        {/* Featured Books Section */}
        <BookSection
          title="Sách Nổi Bật"
          books={featuredBooks}
        />
      </Container>
    </Box>
  );
};

export default HomePage; 