import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Serve static files from frontend build in production
// Always serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ 
      message: "AI Ticket System API", 
      status: "Frontend not built yet",
      note: "Run 'npm run build' to build frontend",
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // For now, skip MongoDB connection to get the server running
    console.log("⚠️  Running without database for demo purposes");
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend dev server should run on http://localhost:5173`);
      console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  Backend server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend dev server should run on http://localhost:5173`);
    });
  }
};

startServer();