# AI-Powered Ticket Management System

A smart ticket management system that uses AI to automatically categorize, prioritize, and assign support tickets to the most appropriate moderators.

## 🚀 Features

- **AI-Powered Ticket Processing**
  - Automatic ticket categorization
  - Smart priority assignment
  - Skill-based moderator matching
  - AI-generated helpful notes for moderators

- **Smart Moderator Assignment**
  - Automatic matching of tickets to moderators based on skills
  - Fallback to admin assignment if no matching moderator found
  - Skill-based routing system

- **User Management**
  - Role-based access control (User, Moderator, Admin)
  - Skill management for moderators
  - User authentication with JWT

- **Background Processing**
  - Event-driven architecture using Inngest
  - Automated email notifications
  - Asynchronous ticket processing

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- DaisyUI
- React Router DOM

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Inngest for background jobs
- Google Gemini AI
- Nodemailer for emails

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Google Gemini API key
- Mailtrap account (for email testing)

## ⚙️ Installation

1. **Clone and install dependencies**
   ```bash
   npm run install:all
   ```

2. **Environment Setup**
   
   Copy the example environment file and update with your credentials:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Update `backend/.env` with your actual values:
   - MongoDB URI
   - JWT Secret
   - Mailtrap credentials
   - Gemini API key

## 🚀 Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:5173 (with API proxy)

### Individual Services

**Backend only:**
```bash
npm run backend:dev
```

**Frontend only:**
```bash
npm run frontend:dev
```

**Inngest dev server (for background jobs):**
```bash
npm run backend:inngest
```

### Production Mode

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## 📁 Project Structure

```
ai-ticket-system/
├── backend/                 # Express.js backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── inngest/            # Background job functions
│   ├── utils/              # Utility functions
│   └── index.js            # Backend entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # Frontend entry point
│   └── dist/               # Built frontend (after npm run build)
└── package.json            # Root package.json for scripts
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout user

### Tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets for logged-in user
- `GET /api/tickets/:id` - Get ticket details

### Admin
- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/update-user` - Update user role & skills (Admin only)

## 🔄 Ticket Processing Flow

1. **Ticket Creation** - User submits ticket
2. **AI Processing** - Inngest analyzes content with Gemini AI
3. **Moderator Assignment** - System matches skills and assigns
4. **Notification** - Email sent to assigned moderator

## 🧪 Testing

1. Start the development servers:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start Inngest dev server:
   ```bash
   npm run backend:inngest
   ```

3. Open http://localhost:5173 in your browser

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key
- `MAILTRAP_SMTP_*` - Email service configuration
- `PORT` - Server port (default: 3000)

**Frontend (.env):**
- `VITE_SERVER_URL` - Backend API URL

## 🚀 Deployment

The application is configured to serve the React frontend from the Express backend in production. Simply:

1. Build the frontend: `npm run build`
2. Start the server: `npm start`
3. Access the full application at the backend URL

## 🤝 Contributing

This project is part of a tutorial series. Please refer to the original repository for contribution guidelines.

## 📄 License

ISC License