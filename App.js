import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import SignupPage from './pages/SignupPage.js';
import LoginPage from './pages/LoginPage.js';
import HomePage from './pages/HomePage.js';
import ProfileViewPage from './pages/ProfileViewPage.js';
import MyProfilePage from './pages/MyProfilePage.js';
import DashboardPage from './pages/DashboardPage.js';
import { getCurrentUser } from './utils/localStorage.js';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  if (loading) {
    return React.createElement('div', {
      className: 'loading-container'
    }, React.createElement('div', {
      className: 'loading-spinner'
    }));
  }

  return React.createElement(Router, null,
    React.createElement('div', {
      className: 'app-container'
    },
      user && React.createElement(Navbar, { user, onLogout: handleLogout }),
      React.createElement(Routes, null,
        React.createElement(Route, {
          path: '/signup',
          element: !user ? React.createElement(SignupPage) : React.createElement(Navigate, { to: '/home' })
        }),
        React.createElement(Route, {
          path: '/login',
          element: !user ? React.createElement(LoginPage, { onLogin: handleLogin }) : React.createElement(Navigate, { to: '/home' })
        }),
        React.createElement(Route, {
          path: '/home',
          element: user ? React.createElement(HomePage, { user }) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, {
          path: '/profile/:userId',
          element: user ? React.createElement(ProfileViewPage, { user }) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, {
          path: '/my-profile',
          element: user ? React.createElement(MyProfilePage, { user, setUser }) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, {
          path: '/dashboard',
          element: user ? React.createElement(DashboardPage, { user }) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, {
          path: '/',
          element: React.createElement(Navigate, { to: user ? '/home' : '/login' })
        })
      )
    )
  );
}

export default App;