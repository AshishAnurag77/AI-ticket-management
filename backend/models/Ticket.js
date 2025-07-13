// Simple in-memory store for demo purposes
const tickets = [];
let ticketIdCounter = 1;

// Mock Ticket model for demo
const Ticket = {
  async create(ticketData) {
    const ticket = {
      _id: ticketIdCounter++,
      status: 'open',
      category: 'general',
      priority: 'medium',
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tickets.push(ticket);
    return ticket;
  },
  
  async find(query = {}) {
    let result = [...tickets];
    if (query.createdBy) {
      result = result.filter(ticket => ticket.createdBy == query.createdBy);
    }
    return {
      populate: (field, select) => ({
        populate: (field2, select2) => ({
          sort: (sortObj) => result
        }),
        sort: (sortObj) => result
      }),
      sort: (sortObj) => result
    };
  },
  
  async findById(id) {
    const ticket = tickets.find(ticket => ticket._id == id);
    if (ticket) {
      return {
        populate: (field, select) => ({
          populate: (field2, select2) => ticket
        })
      };
    }
    return null;
  },
  
  async findByIdAndUpdate(id, updates) {
    const ticketIndex = tickets.findIndex(ticket => ticket._id == id);
    if (ticketIndex !== -1) {
      tickets[ticketIndex] = { ...tickets[ticketIndex], ...updates, updatedAt: new Date() };
      return tickets[ticketIndex];
    }
    return null;
  }
};

export default Ticket;