import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { checkAuthState } from './features/auth/authSlice';
import theme from './theme';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import BookList from './components/Books/BookList';
import BorrowedBooks from './components/Books/BorrowedBooks';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Profile/UserProfile';
import MembershipPlans from './components/Membership/MembershipPlans';
import BookDetail from './components/Books/BookDetail';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from './contexts/NotificationContext';
// Import các components khác...

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuthState());
    }
  }, [dispatch]);

  return (
    <NotificationProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Toaster position="top-right" />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/borrows" element={<BorrowedBooks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/membership" element={<MembershipPlans />} />
              <Route path="/books/:id" element={<BookDetail />} />
              {/* Thêm các routes khác... */}
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App; 