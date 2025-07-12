import { inngest } from "../client.js";
import User from "../../models/User.js";
import { sendEmail } from "../../utils/email.js";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup" },
  { event: "user/signup" },
  async ({ event, step }) => {
    const { userId } = event.data;

    const user = await step.run("get-user", async () => {
      const userObject = await User.findById(userId);
      if (!userObject) {
        throw new Error("User not found");
      }
      return userObject;
    });

    await step.run("send-welcome-email", async () => {
      const subject = `Welcome to the AI Ticket System`;
      const text = `Hello ${user.email},\n\nWelcome to our AI-powered ticket management system!\n\nBest regards,\nThe Team`;
      
      await sendEmail(user.email, subject, text);
    });
  }
);