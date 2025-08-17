import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { loginUser } from '../utils/localStorage.js';

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const result = loginUser(formData.email, formData.password);
    
    if (result.success) {
      onLogin(result.user);
      navigate('/home');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return React.createElement('div', {
    className: 'auth-container'
  },
    React.createElement('div', {
      className: 'auth-card'
    },
      React.createElement('div', {
        className: 'auth-header'
      },
        React.createElement('div', {
          className: 'auth-icon'
        },
          React.createElement(LogIn, { className: 'icon' })
        ),
        React.createElement('h2', {
          className: 'auth-title'
        }, 'Welcome Back'),
        React.createElement('p', {
          className: 'auth-subtitle'
        }, 'Sign in to your account')
      ),
      successMessage && React.createElement('div', {
        className: 'success-message'
      }, successMessage),
      React.createElement('form', {
        onSubmit: handleSubmit,
        className: 'auth-form'
      },
        React.createElement('div', {
          className: 'form-group'
        },
          React.createElement('div', {
            className: 'input-group'
          },
            React.createElement(Mail, { className: 'input-icon' }),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              placeholder: 'Email Address',
              value: formData.email,
              onChange: handleInputChange,
              className: 'form-input',
              disabled: loading
            })
          )
        ),
        React.createElement('div', {
          className: 'form-group'
        },
          React.createElement('div', {
            className: 'input-group'
          },
            React.createElement(Lock, { className: 'input-icon' }),
            React.createElement('input', {
              type: 'password',
              name: 'password',
              placeholder: 'Password',
              value: formData.password,
              onChange: handleInputChange,
              className: 'form-input',
              disabled: loading
            })
          )
        ),
        error && React.createElement('div', {
          className: 'error-message'
        }, error),
        React.createElement('button', {
          type: 'submit',
          className: `submit-btn ${loading ? 'loading' : ''}`,
          disabled: loading
        }, loading ? 'Signing In...' : 'Sign In'),
        React.createElement('div', {
          className: 'auth-footer'
        },
          React.createElement('p', null,
            "Don't have an account? ",
            React.createElement(Link, {
              to: '/signup',
              className: 'auth-link'
            }, 'Sign up')
          )
        )
      )
    )
  );
}

export default LoginPage;