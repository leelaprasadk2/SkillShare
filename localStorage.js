// LocalStorage utility functions
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getCurrentUser = () => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getLearnRequests = () => {
  const requests = localStorage.getItem('learnRequests');
  return requests ? JSON.parse(requests) : [];
};

export const saveLearnRequests = (requests) => {
  localStorage.setItem('learnRequests', JSON.stringify(requests));
};

export const getRatings = () => {
  const ratings = localStorage.getItem('ratings');
  return ratings ? JSON.parse(ratings) : [];
};

export const saveRatings = (ratings) => {
  localStorage.setItem('ratings', JSON.stringify(ratings));
};

export const getSharedContacts = () => {
  const contacts = localStorage.getItem('sharedContacts');
  return contacts ? JSON.parse(contacts) : [];
};

export const saveSharedContacts = (contacts) => {
  localStorage.setItem('sharedContacts', JSON.stringify(contacts));
};

export const signupUser = (userData) => {
  const users = getUsers();
  
  // Check for duplicate email
  if (users.find(user => user.email === userData.email)) {
    return { success: false, message: 'Email already exists' };
  }

  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    skills: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  
  return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    setCurrentUser(user);
    return { success: true, user };
  }
  
  return { success: false, message: 'Invalid credentials' };
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);
    
    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[userIndex]);
    }
    
    return users[userIndex];
  }
  
  return null;
};

export const calculateAverageRating = (userId) => {
  const ratings = getRatings();
  const userRatings = ratings.filter(r => r.ratedUserId === userId);
  
  if (userRatings.length === 0) return 0;
  
  const total = userRatings.reduce((sum, rating) => sum + rating.rating, 0);
  return (total / userRatings.length).toFixed(1);
};

export const addLearnRequest = (fromUserId, toUserId, skill) => {
  const requests = getLearnRequests();
  
  // Check if request already exists
  const existingRequest = requests.find(r => 
    r.fromUserId === fromUserId && 
    r.toUserId === toUserId && 
    r.skill === skill
  );
  
  if (existingRequest) {
    return { success: false, message: 'Request already sent' };
  }

  const newRequest = {
    id: Date.now().toString(),
    fromUserId,
    toUserId,
    skill,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  requests.push(newRequest);
  saveLearnRequests(requests);
  
  return { success: true };
};

export const updateLearnRequest = (requestId, status) => {
  const requests = getLearnRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    requests[requestIndex].status = status;
    requests[requestIndex].updatedAt = new Date().toISOString();
    
    // If accepted, add to shared contacts (bidirectional)
    if (status === 'accepted') {
      const request = requests[requestIndex];
      const users = getUsers();
      const fromUser = users.find(u => u.id === request.fromUserId);
      const toUser = users.find(u => u.id === request.toUserId);
      
      if (fromUser && toUser) {
        const sharedContacts = getSharedContacts();
        
        // Add contact for learner (fromUser gets teacher's contact)
        sharedContacts.push({
          id: Date.now().toString(),
          requestId: request.id,
          userId: request.fromUserId, // Who owns this contact
          contactUserId: request.toUserId, // The contact person
          contactName: toUser.name,
          contactEmail: toUser.email,
          skill: request.skill,
          role: 'teacher', // This person is teaching the skill
          createdAt: new Date().toISOString()
        });
        
        // Add contact for teacher (toUser gets learner's contact)
        sharedContacts.push({
          id: (Date.now() + 1).toString(),
          requestId: request.id,
          userId: request.toUserId, // Who owns this contact
          contactUserId: request.fromUserId, // The contact person
          contactName: fromUser.name,
          contactEmail: fromUser.email,
          skill: request.skill,
          role: 'learner', // This person is learning the skill
          createdAt: new Date().toISOString()
        });
        
        saveSharedContacts(sharedContacts);
      }
    }
    
    saveLearnRequests(requests);
    return requests[requestIndex];
  }
  
  return null;
};

export const addRating = (fromUserId, toUserId, rating) => {
  const ratings = getRatings();
  
  // Check if user already rated this person
  const existingRatingIndex = ratings.findIndex(r => 
    r.raterUserId === fromUserId && r.ratedUserId === toUserId
  );
  
  const newRating = {
    id: Date.now().toString(),
    raterUserId: fromUserId,
    ratedUserId: toUserId,
    rating,
    createdAt: new Date().toISOString()
  };

  if (existingRatingIndex !== -1) {
    // Update existing rating
    ratings[existingRatingIndex] = newRating;
  } else {
    // Add new rating
    ratings.push(newRating);
  }
  
  saveRatings(ratings);
  return newRating;
};

// Get previous learners for a specific user and skill
export const getPreviousLearners = (teacherUserId, skill) => {
  const sharedContacts = getSharedContacts();
  const users = getUsers();
  
  // Find all contacts where this user was the teacher for this skill
  const learnerContacts = sharedContacts.filter(contact => 
    contact.userId === teacherUserId && 
    contact.role === 'learner' && 
    contact.skill === skill
  );
  
  // Get full user details for each learner
  return learnerContacts.map(contact => {
    const learnerUser = users.find(u => u.id === contact.contactUserId);
    return {
      ...contact,
      learnerUser
    };
  });
};

// Get all contacts for a user
export const getUserContacts = (userId) => {
  const sharedContacts = getSharedContacts();
  return sharedContacts.filter(contact => contact.userId === userId);
};