import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// Simple in-memory storage
let users = [];
let tickets = [];
let userIdCounter = 1;
let ticketIdCounter = 1;

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Simple auth routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = {
      _id: userIdCounter++,
      email,
      password, // In real app, hash this
      role: 'user',
      skills: [],
      createdAt: new Date()
    };
    users.push(user);

    // Return success
    res.status(201).json({
      message: "User created successfully",
      token: "fake-jwt-token",
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return success
    res.json({
      message: "Login successful",
      token: "fake-jwt-token",
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    users: users.length,
    tickets: tickets.length
  });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch all handler
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ 
        message: "AI Ticket System API", 
        status: "Running",
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

export default app;