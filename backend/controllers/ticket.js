import Ticket from "../models/Ticket.js";
import { inngest } from "../inngest/client.js";

export const createTicket = async (req, res) => {
  const { title, description } = req.body;
  
  try {
    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
    });

    // Trigger AI processing
    await inngest.send({
      name: "ticket/created",
      data: { ticketId: ticket._id.toString() },
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("createdBy", ["email", "_id"])
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", ["email", "_id"])
      .populate("assignedTo", ["email", "_id"]);
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};