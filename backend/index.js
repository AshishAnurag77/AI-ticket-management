@@ .. @@
 import express from "express";
 import mongoose from "mongoose";
 import cors from "cors";
+import path from "path";
+import { fileURLToPath } from "url";
 import { serve } from "inngest/express";
 import userRoutes from "./routes/user.js";
 import ticketRoutes from "./routes/ticket.js";
@@ .. @@
 import dotenv from "dotenv";
 dotenv.config();

+const __filename = fileURLToPath(import.meta.url);
+const __dirname = path.dirname(__filename);
+
 const PORT = process.env.PORT || 3000;
 const app = express();

 app.use(cors());
 app.use(express.json());

+// Serve static files from frontend build
+app.use(express.static(path.join(__dirname, '../frontend/dist')));
+
 app.use("/api/auth", userRoutes);
 app.use("/api/tickets", ticketRoutes);

@@ .. @@
     functions: [onUserSignup, onTicketCreated],
   })
 );

+// Catch all handler: send back React's index.html file for any non-API routes
+app.get('*', (req, res) => {
+  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
+});
+
 mongoose