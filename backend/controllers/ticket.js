let tickets = [];
if (user.role !== "user") {
  tickets = await Ticket.find({})
    .populate("assignedTo", ["email", "_id"])
    .sort({ createdAt: -1 });
} else {
}