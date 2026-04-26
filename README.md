# 🚀 Event Management System

A sophisticated, full-stack Event Management platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Designed for campus organizations to manage events with real-time analytics, secure role-based access, and a premium, modern aesthetic.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/stack-MERN-green)

---

## 🌟 Key Features

### 🔐 Multi-Tier Authentication
- **Secure JWT Implementation**: Industry-standard session management.
- **Strict RBAC (Role-Based Access Control)**: Custom dashboards for Students, Club Admins, and the System Super Admin.
- **Zero-Friction Access**: No email verification required for immediate recruiter testing.

### 🏠 Role-Specific Dashboards
- **🧑‍🎓 Student Hub**: Browse upcoming events, view beautiful "Pop-out" details, and track personal registrations in the "My Journeys" section.
- **🧑‍💼 Club Admin Hub**: manage society-specific events, track real-time registration counts, and access detailed participant lists for every event.
- **🧑‍💻 Super Admin Command Center**: Global oversight of system stats, user management (promoting/demoting roles), and total event control.

### 🎨 Premium UI/UX
- **Modern Aesthetics**: Sleek dark mode with glassmorphism effects.
- **Responsive Design**: Fully functional on mobile, tablet, and desktop.
- **Dynamic Interactions**: Smooth animations powered by Framer Motion.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Security**: Bcrypt.js (Hashing), JSON Web Tokens (Auth).
- **Deployment**: Vercel (Frontend), Render (Backend).

---

## 🧪 Try it Out (Live Demo)

You can explore the different roles using these pre-seeded credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `23051222@kiit.ac.in` | `123456` | System Control |
| **Club Admin** | `snigdha5002@gmail.com` | `123456` | ELabs Organizer |
| **Student** | `supernovascience2023@gmail.com` | `123456` | Participant |

---

## 🚀 Getting Started

1. **Clone the Repo**
   ```bash
   git clone https://github.com/snigdha1284/Event-Management-System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
---
