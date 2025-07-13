import mongoose from "mongoose";

// Create a simple in-memory store for demo purposes
const tickets = [];
let ticketIdCounter = 1;

// Mock Ticket model for demo
const Ticket = {
  async create(ticketData) {
    const ticket = {
      _id: ticketIdCounter++,
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
    return result;
  },
  
  async findById(id) {
    return tickets.find(ticket => ticket._id == id);
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

/* Original Mongoose schema - commented out for demo
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["technical", "billing", "general", "bug", "feature"],
    default: "general",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved", "closed"],
    default: "open",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  aiNotes: {
    type: String,
  },
}, {
  timestamps: true,
});
