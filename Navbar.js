import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, BarChart3, LogOut } from 'lucide-react';

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/my-profile', icon: User, label: 'My Profile' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' }
  ];

  return React.createElement('nav', {
    className: 'navbar'
  },
    React.createElement('div', {
      className: 'navbar-container'
    },
      React.createElement('div', {
        className: 'navbar-brand'
      },
        React.createElement(Link, {
          to: '/home',
          className: 'brand-link'
        }, 'SkillShare')
      ),
      React.createElement('div', {
        className: 'navbar-menu'
      },
        React.createElement('div', {
          className: 'navbar-nav'
        },
          ...navItems.map(item =>
            React.createElement(Link, {
              key: item.path,
              to: item.path,
              className: `nav-link ${location.pathname === item.path ? 'active' : ''}`
            },
              React.createElement(item.icon, { className: 'nav-icon' }),
              React.createElement('span', { className: 'nav-text' }, item.label)
            )
          )
        ),
        React.createElement('div', {
          className: 'navbar-user'
        },
          React.createElement('span', {
            className: 'user-name'
          }, `Welcome, ${user.name}`),
          React.createElement('button', {
            onClick: handleLogout,
            className: 'logout-btn'
          },
            React.createElement(LogOut, { className: 'logout-icon' }),
            React.createElement('span', { className: 'logout-text' }, 'Logout')
          )
        )
      )
    )
  );
}

export default Navbar;