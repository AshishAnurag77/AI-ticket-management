import { inngest } from "../client.js";
import Ticket from "../../models/Ticket.js";
import User from "../../models/User.js";
import { analyzeTicket } from "../../utils/ai.js";
import { sendEmail } from "../../utils/email.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created" },
  { event: "ticket/created" },
  async ({ event, step }) => {
    const { ticketId } = event.data;

    const ticket = await step.run("get-ticket", async () => {
      const ticketObject = await Ticket.findById(ticketId);
      if (!ticketObject) {
        throw new Error("Ticket not found");
      }
      return ticketObject;
    });

    const analysis = await step.run("analyze-ticket", async () => {
      return await analyzeTicket(ticket.title, ticket.description);
    });

    const moderator = await step.run("assign-moderator", async () => {
      let assignedModerator = null;

      if (analysis.category) {
        assignedModerator = await User.findOne({
          role: { $in: ["moderator", "admin"] },
          skills: { $in: [analysis.category] },
        });
      }

      if (!assignedModerator) {
        assignedModerator = await User.findOne({ role: "admin" });
      }

      if (assignedModerator) {
        await Ticket.findByIdAndUpdate(ticketId, {
          category: analysis.category,
          priority: analysis.priority,
          assignedTo: assignedModerator._id,
          aiNotes: analysis.notes,
        });
      }

      return assignedModerator;
    });

    await step.run("send-email-notification", async () => {
      if (moderator) {
        const subject = `New Ticket Assigned: ${ticket.title}`;
        const text = `Hello ${moderator.email},\n\nA new ticket has been assigned to you:\n\nTitle: ${ticket.title}\nCategory: ${analysis.category}\nPriority: ${analysis.priority}\n\nAI Notes: ${analysis.notes}\n\nPlease log in to view the full details.\n\nBest regards,\nThe System`;
        
        await sendEmail(moderator.email, subject, text);
      }
    });
  }
);