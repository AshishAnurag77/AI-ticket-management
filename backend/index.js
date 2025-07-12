import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { serve } from "inngest/express";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { onUserSignup, onTicketCreated } from "./inngest/functions/index.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

// Inngest endpoint
app.use(
  "/api/inngest",
  serve({
    id: "ai-ticket-system",
    functions: [onUserSignup, onTicketCreated],
  })
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Development mode - just show API status
  app.get('/', (req, res) => {
    res.json({ 
      message: "AI Ticket System API", 
      status: "Development Mode",
      frontend: "http://localhost:5173"
    });
  });
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai-tickets")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend dev server should run on http://localhost:5173`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    // Start server anyway for development
    app.listen(PORT, () => {
      console.log(`⚠️  Backend server running on http://localhost:${PORT} (MongoDB not connected)`);
      console.log(`📱 Frontend dev server should run on http://localhost:5173`);
    });
  });