import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Container,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import api from '../../api/axios';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const fetchBooks = React.useCallback(async (searchTerm = search) => {
    try {
      setLoading(true);
      const response = await api.get('/v1/open/books', {
        params: {
          page: currentPage,
          category: selectedCategory || '',
          sort: sortBy,
          q: searchTerm?.trim(),
          per_page: 12
        }
      });
      
      setBooks(response.data.data);
      const total = response.data.total || 0;
      const perPage = response.data.per_page || 12;
      setTotalPages(Math.max(1, Math.ceil(total / perPage)));
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, sortBy, search]);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, [currentPage, selectedCategory, sortBy, fetchBooks]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/v1/open/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #fff 100%)',
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Title Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #4F46E5 30%, #7C3AED 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Thư Viện Sách
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Khám phá kho tàng tri thức với hàng nghìn đầu sách đa dạng
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm sách..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      '&:hover': {
                        '& > fieldset': { borderColor: '#4F46E5' }
                      }
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      fetchBooks(search);
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => fetchBooks(search)}
                  sx={{
                    background: 'linear-gradient(45deg, #4F46E5 30%, #7C3AED 90%)',
                    color: 'white',
                    minWidth: '120px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4F46E5 30%, #7C3AED 60%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  Tìm kiếm
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Thể loại</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Thể loại"
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sắp xếp theo"
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                >
                  <MenuItem value="title">Tên sách</MenuItem>
                  <MenuItem value="created_at">Mới nhất</MenuItem>
                  <MenuItem value="quantity">Số lượng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Books Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`/images/${book.image}`}
                      alt={book.title}
                      sx={{ 
                        height: 280,
                        objectFit: 'contain',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} mb={1}>
                        <Chip 
                          icon={<CategoryIcon sx={{ fontSize: 16 }} />}
                          label={book.category?.name}
                          size="small"
                          sx={{ 
                            bgcolor: '#4F46E5',
                            color: 'white',
                            '& .MuiChip-icon': { color: 'white' }
                          }}
                        />
                        <Chip
                          label={`Còn ${book.quantity} cuốn`}
                          size="small"
                          color={book.quantity > 0 ? "success" : "error"}
                        />
                      </Stack>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          height: '2.4em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {book.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          height: '3em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {book.description}
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/books/${book.id}`)}
                        sx={{
                          background: 'linear-gradient(45deg, #4F46E5 30%, #7C3AED 90%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #7C3AED 30%, #4F46E5 90%)',
                          }
                        }}
                      >
                        Chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 0 && (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      '&.Mui-selected': {
                        bgcolor: '#4F46E5',
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default BookList; 