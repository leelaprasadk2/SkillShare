import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Users } from 'lucide-react';
import { getUsers, calculateAverageRating } from '../utils/localStorage.js';

function HomePage({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allUsers = getUsers();
    const otherUsers = allUsers.filter(u => u.id !== user.id);
    setUsers(otherUsers);
  }, [user.id]);

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        React.createElement(Star, {
          key: i,
          className: i <= numRating ? 'star filled' : 'star',
          fill: i <= numRating ? 'currentColor' : 'none'
        })
      );
    }
    
    return stars;
  };

  if (users.length === 0) {
    return React.createElement('div', {
      className: 'page-container'
    },
      React.createElement('div', {
        className: 'page-header'
      },
        React.createElement('h1', {
          className: 'page-title'
        }, 'Home'),
        React.createElement('p', {
          className: 'page-subtitle'
        }, 'Connect with skilled professionals')
      ),
      React.createElement('div', {
        className: 'empty-state'
      },
        React.createElement(Users, { className: 'empty-icon' }),
        React.createElement('h3', null, 'No other users yet'),
        React.createElement('p', null, 'Be the first to connect with other learners!')
      )
    );
  }

  return React.createElement('div', {
    className: 'page-container'
  },
    React.createElement('div', {
      className: 'page-header'
    },
      React.createElement('h1', {
        className: 'page-title'
      }, 'Discover Skills'),
      React.createElement('p', {
        className: 'page-subtitle'
      }, `Connect with ${users.length} skilled professionals`)
    ),
    React.createElement('div', {
      className: 'users-grid'
    },
      ...users.map(otherUser => {
        const avgRating = calculateAverageRating(otherUser.id);
        
        return React.createElement('div', {
          key: otherUser.id,
          className: 'user-card'
        },
          React.createElement('div', {
            className: 'user-avatar'
          },
            React.createElement('div', {
              className: 'avatar-circle'
            }, otherUser.name.charAt(0).toUpperCase())
          ),
          React.createElement('div', {
            className: 'user-info'
          },
            React.createElement('h3', {
              className: 'user-name'
            }, otherUser.name),
            React.createElement('div', {
              className: 'user-rating'
            },
              React.createElement('div', {
                className: 'stars'
              }, ...renderStars(avgRating)),
              React.createElement('span', {
                className: 'rating-text'
              }, `${avgRating}/5`)
            ),
            React.createElement('div', {
              className: 'user-skills'
            },
              React.createElement('h4', null, 'Skills:'),
              otherUser.skills && otherUser.skills.length > 0
                ? React.createElement('div', {
                    className: 'skills-list'
                  },
                    ...otherUser.skills.map((skill, index) =>
                      React.createElement('span', {
                        key: index,
                        className: 'skill-tag'
                      }, skill)
                    )
                  )
                : React.createElement('p', {
                    className: 'no-skills'
                  }, 'No skills listed yet')
            ),
            React.createElement('div', {
              className: 'user-actions'
            },
              React.createElement(Link, {
                to: `/profile/${otherUser.id}`,
                className: 'btn btn-primary'
              },
                React.createElement(Eye, { className: 'btn-icon' }),
                'View Profile'
              )
            )
          )
        );
      })
    )
  );
}

export default HomePage;