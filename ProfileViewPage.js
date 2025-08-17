import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, Award } from 'lucide-react';
import { getUsers, addLearnRequest, addRating, calculateAverageRating } from '../utils/localStorage.js';

function ProfileViewPage({ user }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const users = getUsers();
    const targetUser = users.find(u => u.id === userId);
    
    if (!targetUser) {
      navigate('/home');
      return;
    }
    
    setProfileUser(targetUser);
  }, [userId, navigate]);

  const handleLearnRequest = (skill) => {
    const result = addLearnRequest(user.id, userId, skill);
    
    if (result.success) {
      setMessage(`Learn request sent for "${skill}"!`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setError(result.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    addRating(user.id, userId, newRating);
    setMessage('Rating submitted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const renderStars = (currentRating, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        React.createElement(Star, {
          key: i,
          className: `star ${i <= currentRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`,
          fill: i <= currentRating ? 'currentColor' : 'none',
          onClick: interactive ? () => handleRating(i) : undefined
        })
      );
    }
    
    return stars;
  };

  if (!profileUser) {
    return React.createElement('div', {
      className: 'loading-container'
    },
      React.createElement('div', {
        className: 'loading-spinner'
      })
    );
  }

  const avgRating = calculateAverageRating(profileUser.id);

  return React.createElement('div', {
    className: 'page-container'
  },
    React.createElement('div', {
      className: 'page-header'
    },
      React.createElement('button', {
        onClick: () => navigate('/home'),
        className: 'back-btn'
      },
        React.createElement(ArrowLeft, { className: 'back-icon' }),
        'Back to Home'
      ),
      React.createElement('h1', {
        className: 'page-title'
      }, 'User Profile')
    ),
    React.createElement('div', {
      className: 'profile-container'
    },
      React.createElement('div', {
        className: 'profile-card'
      },
        React.createElement('div', {
          className: 'profile-header'
        },
          React.createElement('div', {
            className: 'profile-avatar large'
          },
            React.createElement('div', {
              className: 'avatar-circle large'
            }, profileUser.name.charAt(0).toUpperCase())
          ),
          React.createElement('div', {
            className: 'profile-info'
          },
            React.createElement('h2', {
              className: 'profile-name'
            }, profileUser.name),
            React.createElement('div', {
              className: 'profile-rating'
            },
              React.createElement('div', {
                className: 'stars'
              }, ...renderStars(parseFloat(avgRating))),
              React.createElement('span', {
                className: 'rating-text'
              }, `${avgRating}/5 average rating`)
            )
          )
        ),
        React.createElement('div', {
          className: 'profile-section'
        },
          React.createElement('h3', {
            className: 'section-title'
          },
            React.createElement(BookOpen, { className: 'section-icon' }),
            'Skills'
          ),
          profileUser.skills && profileUser.skills.length > 0
            ? React.createElement('div', {
                className: 'skills-grid'
              },
                ...profileUser.skills.map((skill, index) =>
                  React.createElement('div', {
                    key: index,
                    className: 'skill-card'
                  },
                    React.createElement('span', {
                      className: 'skill-name'
                    }, skill),
                    React.createElement('button', {
                      onClick: () => handleLearnRequest(skill),
                      className: 'btn btn-secondary btn-sm'
                    }, 'Learn')
                  )
                )
              )
            : React.createElement('p', {
                className: 'empty-message'
              }, 'No skills listed yet')
        ),
        React.createElement('div', {
          className: 'profile-section'
        },
          React.createElement('h3', {
            className: 'section-title'
          },
            React.createElement(Award, { className: 'section-icon' }),
            'Rate this user'
          ),
          React.createElement('div', {
            className: 'rating-section'
          },
            React.createElement('p', null, 'Click on stars to rate:'),
            React.createElement('div', {
              className: 'stars interactive'
            }, ...renderStars(rating, true))
          )
        ),
        (message || error) && React.createElement('div', {
          className: `message ${error ? 'error' : 'success'}`
        }, message || error)
      )
    )
  );
}

export default ProfileViewPage;