import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Trophy, Users, Eye, BookOpen } from 'lucide-react';
import { getUsers, calculateAverageRating, getPreviousLearners } from '../utils/localStorage.js';

function DashboardPage({ user }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [previousLearners, setPreviousLearners] = useState([]);
  const [showPreviousLearners, setShowPreviousLearners] = useState(false);

  useEffect(() => {
    const allUsers = getUsers();
    const otherUsers = allUsers.filter(u => u.id !== user.id);
    
    // Calculate ratings and sort by highest rating
    const usersWithRatings = otherUsers.map(u => ({
      ...u,
      averageRating: parseFloat(calculateAverageRating(u.id)) || 0
    })).sort((a, b) => b.averageRating - a.averageRating);
    
    setUsers(usersWithRatings);
    setFilteredUsers(usersWithRatings);
  }, [user.id]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.skills && u.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleViewPreviousLearners = (targetUser, skill) => {
    const learners = getPreviousLearners(targetUser.id, skill);
    setSelectedUser(targetUser);
    setSelectedSkill(skill);
    setPreviousLearners(learners);
    setShowPreviousLearners(true);
  };

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

  const getRankIcon = (index) => {
    if (index === 0) return React.createElement('span', { className: 'rank-badge gold' }, '🥇');
    if (index === 1) return React.createElement('span', { className: 'rank-badge silver' }, '🥈');
    if (index === 2) return React.createElement('span', { className: 'rank-badge bronze' }, '🥉');
    return React.createElement('span', { className: 'rank-number' }, `#${index + 1}`);
  };

  if (showPreviousLearners) {
    return React.createElement('div', {
      className: 'page-container'
    },
      React.createElement('div', {
        className: 'page-header'
      },
        React.createElement('button', {
          onClick: () => setShowPreviousLearners(false),
          className: 'back-btn'
        }, '← Back to Dashboard'),
        React.createElement('h1', {
          className: 'page-title'
        },
          React.createElement(BookOpen, { className: 'title-icon' }),
          `Previous Learners - ${selectedSkill}`
        ),
        React.createElement('p', {
          className: 'page-subtitle'
        }, `Students who learned ${selectedSkill} from ${selectedUser.name}`)
      ),
      previousLearners.length === 0 ? (
        React.createElement('div', {
          className: 'empty-state'
        },
          React.createElement(Users, { className: 'empty-icon' }),
          React.createElement('h3', null, 'No previous learners'),
          React.createElement('p', null, `No one has learned ${selectedSkill} from ${selectedUser.name} yet.`)
        )
      ) : (
        React.createElement('div', {
          className: 'learners-grid'
        },
          ...previousLearners.map(learner =>
            React.createElement('div', {
              key: learner.id,
              className: 'learner-card'
            },
              React.createElement('div', {
                className: 'user-avatar'
              },
                React.createElement('div', {
                  className: 'avatar-circle'
                }, learner.learnerUser?.name?.charAt(0).toUpperCase())
              ),
              React.createElement('div', {
                className: 'learner-info'
              },
                React.createElement('h3', {
                  className: 'learner-name'
                }, learner.learnerUser?.name),
                React.createElement('p', {
                  className: 'learner-email'
                }, learner.contactEmail),
                React.createElement('p', {
                  className: 'learner-skill'
                }, `Learned: ${learner.skill}`),
                React.createElement('p', {
                  className: 'learner-date'
                }, `Connected: ${new Date(learner.createdAt).toLocaleDateString()}`)
              ),
              React.createElement('div', {
                className: 'learner-actions'
              },
                React.createElement(Link, {
                  to: `/profile/${learner.contactUserId}`,
                  className: 'btn btn-primary btn-sm'
                },
                  React.createElement(Eye, { className: 'btn-icon' }),
                  'View Profile'
                )
              )
            )
          )
        )
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
      },
        React.createElement(Trophy, { className: 'title-icon' }),
        'Dashboard'
      ),
      React.createElement('p', {
        className: 'page-subtitle'
      }, 'Users ranked by highest ratings')
    ),
    React.createElement('div', {
      className: 'dashboard-controls'
    },
      React.createElement('div', {
        className: 'search-container'
      },
        React.createElement('div', {
          className: 'search-input-group'
        },
          React.createElement(Search, { className: 'search-icon' }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search by name or skill...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: 'search-input'
          })
        )
      ),
      React.createElement('div', {
        className: 'dashboard-stats'
      },
        React.createElement('div', {
          className: 'stat-item'
        },
          React.createElement(Users, { className: 'stat-icon' }),
          React.createElement('span', null, `${filteredUsers.length} Users`)
        )
      )
    ),
    filteredUsers.length === 0 ? (
      React.createElement('div', {
        className: 'empty-state'
      },
        React.createElement(Users, { className: 'empty-icon' }),
        React.createElement('h3', null, searchTerm ? 'No users found' : 'No other users yet'),
        React.createElement('p', null, searchTerm 
          ? 'Try adjusting your search terms' 
          : 'Be the first to connect with other learners!'
        )
      )
    ) : (
      React.createElement('div', {
        className: 'leaderboard'
      },
        ...filteredUsers.map((rankedUser, index) =>
          React.createElement('div', {
            key: rankedUser.id,
            className: `leaderboard-item ${index < 3 ? 'top-three' : ''}`
          },
            React.createElement('div', {
              className: 'rank-section'
            }, getRankIcon(index)),
            React.createElement('div', {
              className: 'user-section'
            },
              React.createElement('div', {
                className: 'user-avatar'
              },
                React.createElement('div', {
                  className: 'avatar-circle'
                }, rankedUser.name.charAt(0).toUpperCase())
              ),
              React.createElement('div', {
                className: 'user-details'
              },
                React.createElement('h3', {
                  className: 'user-name'
                }, rankedUser.name),
                React.createElement('div', {
                  className: 'user-rating'
                },
                  React.createElement('div', {
                    className: 'stars'
                  }, ...renderStars(rankedUser.averageRating)),
                  React.createElement('span', {
                    className: 'rating-text'
                  }, `${rankedUser.averageRating.toFixed(1)}/5`)
                ),
                rankedUser.skills && rankedUser.skills.length > 0 && (
                  React.createElement('div', {
                    className: 'skills-preview'
                  },
                    React.createElement('span', {
                      className: 'skills-label'
                    }, 'Skills: '),
                    React.createElement('div', {
                      className: 'skills-tags'
                    },
                      ...rankedUser.skills.slice(0, 3).map((skill, skillIndex) =>
                        React.createElement('div', {
                          key: skillIndex,
                          className: 'skill-tag-container'
                        },
                          React.createElement('span', {
                            className: 'skill-tag small'
                          }, skill),
                          React.createElement('button', {
                            onClick: () => handleViewPreviousLearners(rankedUser, skill),
                            className: 'previous-learners-btn',
                            title: 'View previous learners'
                          }, '👥')
                        )
                      ),
                      rankedUser.skills.length > 3 && React.createElement('span', {
                        className: 'skill-tag small more'
                      }, `+${rankedUser.skills.length - 3} more`)
                    )
                  )
                )
              )
            ),
            React.createElement('div', {
              className: 'action-section'
            },
              React.createElement(Link, {
                to: `/profile/${rankedUser.id}`,
                className: 'btn btn-primary btn-sm'
              },
                React.createElement(Eye, { className: 'btn-icon' }),
                'View Profile'
              )
            )
          )
        )
      )
    )
  );
}

export default DashboardPage;