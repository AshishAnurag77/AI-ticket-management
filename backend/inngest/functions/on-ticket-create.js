const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;

        return user;
      });

      await step.run("send-email-notification", async () => {
        if (moderator) {