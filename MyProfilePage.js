import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Check, X, Mail, Users } from 'lucide-react';
import { updateUser, getLearnRequests, updateLearnRequest, getUsers, getUserContacts } from '../utils/localStorage.js';

function MyProfilePage({ user, setUser }) {
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [learnRequests, setLearnRequests] = useState([]);
  const [sharedContacts, setSharedContacts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get incoming learn requests
    const allRequests = getLearnRequests();
    const incomingRequests = allRequests.filter(r => 
      r.toUserId === user.id && r.status === 'pending'
    );
    
    // Get user details for requests
    const users = getUsers();
    const requestsWithUserInfo = incomingRequests.map(request => ({
      ...request,
      fromUser: users.find(u => u.id === request.fromUserId)
    }));
    
    setLearnRequests(requestsWithUserInfo);

    // Get all contacts for this user (both as teacher and learner)
    const userContacts = getUserContacts(user.id);
    const contactsWithUserInfo = userContacts.map(contact => ({
      ...contact,
      contactUser: users.find(u => u.id === contact.contactUserId)
    }));
    
    setSharedContacts(contactsWithUserInfo);
  }, [user.id]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    
    if (!newSkill.trim()) return;
    
    if (skills.includes(newSkill.trim())) {
      setMessage('Skill already exists');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    
    const updatedUser = updateUser(user.id, { skills: updatedSkills });
    setUser(updatedUser);
    
    setNewSkill('');
    setMessage('Skill added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = skills.filter(skill => skill !== skillToDelete);
    setSkills(updatedSkills);
    
    const updatedUser = updateUser(user.id, { skills: updatedSkills });
    setUser(updatedUser);
    
    setMessage('Skill deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRequestAction = (requestId, action) => {
    updateLearnRequest(requestId, action);
    
    // Refresh requests
    const allRequests = getLearnRequests();
    const incomingRequests = allRequests.filter(r => 
      r.toUserId === user.id && r.status === 'pending'
    );
    
    const users = getUsers();
    const requestsWithUserInfo = incomingRequests.map(request => ({
      ...request,
      fromUser: users.find(u => u.id === request.fromUserId)
    }));
    
    setLearnRequests(requestsWithUserInfo);
    
    if (action === 'accepted') {
      setMessage('Request accepted! Contacts shared successfully.');
      
      // Refresh shared contacts
      const userContacts = getUserContacts(user.id);
      const contactsWithUserInfo = userContacts.map(contact => ({
        ...contact,
        contactUser: users.find(u => u.id === contact.contactUserId)
      }));
      
      setSharedContacts(contactsWithUserInfo);
    } else {
      setMessage('Request rejected.');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  return React.createElement('div', {
    className: 'page-container'
  },
    React.createElement('div', {
      className: 'page-header'
    },
      React.createElement('h1', {
        className: 'page-title'
      }, 'My Profile'),
      React.createElement('p', {
        className: 'page-subtitle'
      }, 'Manage your skills and learn requests')
    ),
    React.createElement('div', {
      className: 'profile-grid'
    },
      // Profile Info Section
      React.createElement('div', {
        className: 'profile-section-card'
      },
        React.createElement('div', {
          className: 'section-header'
        },
          React.createElement(User, { className: 'section-icon' }),
          React.createElement('h2', null, 'Profile Information')
        ),
        React.createElement('div', {
          className: 'profile-details'
        },
          React.createElement('div', {
            className: 'profile-avatar large'
          },
            React.createElement('div', {
              className: 'avatar-circle large'
            }, user.name.charAt(0).toUpperCase())
          ),
          React.createElement('div', {
            className: 'profile-info'
          },
            React.createElement('h3', null, user.name),
            React.createElement('p', null, user.email)
          )
        )
      ),
      // Skills Section
      React.createElement('div', {
        className: 'profile-section-card'
      },
        React.createElement('div', {
          className: 'section-header'
        },
          React.createElement('h2', null, 'My Skills'),
          React.createElement('span', {
            className: 'skills-count'
          }, `${skills.length} skills`)
        ),
        React.createElement('form', {
          onSubmit: handleAddSkill,
          className: 'add-skill-form'
        },
          React.createElement('div', {
            className: 'input-group'
          },
            React.createElement('input', {
              type: 'text',
              value: newSkill,
              onChange: (e) => setNewSkill(e.target.value),
              placeholder: 'Add a new skill',
              className: 'form-input'
            }),
            React.createElement('button', {
              type: 'submit',
              className: 'btn btn-primary'
            },
              React.createElement(Plus, { className: 'btn-icon' }),
              'Add'
            )
          )
        ),
        React.createElement('div', {
          className: 'skills-list'
        },
          skills.length > 0
            ? skills.map((skill, index) =>
                React.createElement('div', {
                  key: index,
                  className: 'skill-item'
                },
                  React.createElement('span', {
                    className: 'skill-name'
                  }, skill),
                  React.createElement('button', {
                    onClick: () => handleDeleteSkill(skill),
                    className: 'btn btn-danger btn-sm'
                  },
                    React.createElement(Trash2, { className: 'btn-icon' })
                  )
                )
              )
            : React.createElement('p', {
                className: 'empty-message'
              }, 'No skills added yet. Add your first skill above!')
        )
      ),
      // Learn Requests Section
      React.createElement('div', {
        className: 'profile-section-card'
      },
        React.createElement('div', {
          className: 'section-header'
        },
          React.createElement('h2', null, 'Incoming Learn Requests'),
          React.createElement('span', {
            className: 'requests-count'
          }, `${learnRequests.length} pending`)
        ),
        React.createElement('div', {
          className: 'requests-list'
        },
          learnRequests.length > 0
            ? learnRequests.map(request =>
                React.createElement('div', {
                  key: request.id,
                  className: 'request-item'
                },
                  React.createElement('div', {
                    className: 'request-info'
                  },
                    React.createElement('div', {
                      className: 'request-user'
                    },
                      React.createElement('div', {
                        className: 'user-avatar small'
                      },
                        React.createElement('div', {
                          className: 'avatar-circle small'
                        }, request.fromUser?.name?.charAt(0).toUpperCase())
                      ),
                      React.createElement('div', null,
                        React.createElement('h4', null, request.fromUser?.name),
                        React.createElement('p', null, `wants to learn: ${request.skill}`)
                      )
                    )
                  ),
                  React.createElement('div', {
                    className: 'request-actions'
                  },
                    React.createElement('button', {
                      onClick: () => handleRequestAction(request.id, 'accepted'),
                      className: 'btn btn-success btn-sm'
                    },
                      React.createElement(Check, { className: 'btn-icon' }),
                      'Accept'
                    ),
                    React.createElement('button', {
                      onClick: () => handleRequestAction(request.id, 'rejected'),
                      className: 'btn btn-danger btn-sm'
                    },
                      React.createElement(X, { className: 'btn-icon' }),
                      'Reject'
                    )
                  )
                )
              )
            : React.createElement('p', {
                className: 'empty-message'
              }, 'No pending learn requests')
        )
      ),
      // Shared Contacts Section
      sharedContacts.length > 0 && React.createElement('div', {
        className: 'profile-section-card'
      },
        React.createElement('div', {
          className: 'section-header'
        },
          React.createElement(Mail, { className: 'section-icon' }),
          React.createElement('h2', null, 'My Contacts'),
          React.createElement('span', {
            className: 'contacts-count'
          }, `${sharedContacts.length} contacts`)
        ),
        React.createElement('div', {
          className: 'contacts-list'
        },
          sharedContacts.map(contact =>
            React.createElement('div', {
              key: contact.id,
              className: 'contact-item'
            },
              React.createElement('div', {
                className: 'contact-info'
              },
                React.createElement('div', {
                  className: 'contact-user'
                },
                  React.createElement('div', {
                    className: 'user-avatar small'
                  },
                    React.createElement('div', {
                      className: 'avatar-circle small'
                    }, contact.contactUser?.name?.charAt(0).toUpperCase())
                  ),
                  React.createElement('div', null,
                    React.createElement('h4', null, contact.contactUser?.name),
                    React.createElement('p', null, `${contact.role === 'teacher' ? 'Teaching' : 'Learning'}: ${contact.skill}`),
                    React.createElement('p', {
                      className: 'contact-email'
                    }, contact.contactEmail),
                    React.createElement('p', {
                      className: 'contact-role'
                    }, contact.role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student')
                  )
                )
              )
            )
          )
        )
      )
    ),
    message && React.createElement('div', {
      className: 'message success fixed'
    }, message)
  );
}

export default MyProfilePage;