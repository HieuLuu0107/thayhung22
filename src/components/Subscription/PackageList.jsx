import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import api from '../../api/axios';

const PackageList = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/v1/open/packages');
        if (response.data) {
          setPackages(response.data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  const handleSubscribe = async (packageId) => {
    try {
      await api.post('/subscribe', {
        package_id: packageId,
        payment_method: 'card', // Implement payment method selection
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gói Thành Viên
      </Typography>
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} md={6} key={pkg.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(pkg.price)}
                  /tháng
                </Typography>
                <Typography>{pkg.description}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`Mượn tối đa ${pkg.max_borrows} cuốn`}
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${pkg.borrow_duration} ngày mượn`}
                    color="secondary"
                    sx={{ mr: 1 }}
                  />
                  {pkg.can_reserve && (
                    <Chip label="Đặt trước sách" color="success" />
                  )}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleSubscribe(pkg.id)}
                >
                  Đăng ký ngay
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PackageList; 