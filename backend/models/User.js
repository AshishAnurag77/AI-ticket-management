// Simple in-memory store for demo purposes
const users = [];
let userIdCounter = 1;

// Mock User model for demo
const User = {
  async findOne(query) {
    if (query.email) {
      return users.find(user => user.email === query.email);
    }
    if (query._id) {
      return users.find(user => user._id == query._id);
    }
    if (query.role) {
      return users.find(user => user.role === query.role || (query.role.$in && query.role.$in.includes(user.role)));
    }
    return null;
  },
  
  async create(userData) {
    const user = {
      _id: userIdCounter++,
      role: 'user',
      skills: [],
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  },
  
  async find(query = {}, projection) {
    let result = [...users];
    if (projection === "-password") {
      result = result.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    }
    return result;
  },
  
  async findById(id) {
    return users.find(user => user._id == id);
  },
  
  async findByIdAndUpdate(id, updates, options) {
    const userIndex = users.findIndex(user => user._id == id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date() };
      if (options?.new) {
        const { password, ...userWithoutPassword } = users[userIndex];
        return userWithoutPassword;
      }
      return users[userIndex];
    }
    return null;
  }
};

export default User;