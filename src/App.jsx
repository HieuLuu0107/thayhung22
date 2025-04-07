import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookList from './components/Books/BookList';
import PackageList from './components/Subscription/PackageList';
import UserProfile from './components/Profile/UserProfile';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ProtectedRoute from './components/ProtectedRoute';
import BorrowedBooks from './components/Books/BorrowedBooks';
import HomePage from './components/Home/HomePage';
import { useSelector } from 'react-redux';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.token);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/books" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/books" /> : <Register />
          } />

          {/* Protected Routes */}
          <Route path="/books" element={
            <ProtectedRoute>
              <Layout>
                <BookList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/borrows" element={
            <ProtectedRoute>
              <Layout>
                <BorrowedBooks />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App; 