import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { signupUser } from '../utils/localStorage.js';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = signupUser(formData);
    
    if (result.success) {
      // Redirect to login page after successful signup
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
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
          React.createElement(UserPlus, { className: 'icon' })
        ),
        React.createElement('h2', {
          className: 'auth-title'
        }, 'Create Account'),
        React.createElement('p', {
          className: 'auth-subtitle'
        }, 'Join our skill-sharing community')
      ),
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
            React.createElement(User, { className: 'input-icon' }),
            React.createElement('input', {
              type: 'text',
              name: 'name',
              placeholder: 'Full Name',
              value: formData.name,
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
        }, loading ? 'Creating Account...' : 'Create Account'),
        React.createElement('div', {
          className: 'auth-footer'
        },
          React.createElement('p', null,
            'Already have an account? ',
            React.createElement(Link, {
              to: '/login',
              className: 'auth-link'
            }, 'Sign in')
          )
        )
      )
    )
  );
}

export default SignupPage;