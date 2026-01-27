# Internship Management System

A complete MERN stack Internship Management System with role-based access.

---

## 🚀 Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 👥 Roles

### Admin

- Manage mentors
- Manage interns
- Create internship programs

### Mentor

- Create tasks
- Review intern submissions
- Track intern performance

### Intern

- View programs
- Submit tasks
- View performance
- Download certificate

---

## 📂 Project Structure

client/ → React frontend
server/ → Node + Express backend

---

## ⚙️ Setup Instructions

### Backend

```bash
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm run dev
```

## ⚙️ Environment Variables
-server/.env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret

-client/.env
VITE_API_URL=http://localhost:5000/api

## status
✔ Authentication
✔ Role-based access
✔ Task submission
✔ Task review
✔ Performance tracking
✔ Certificate generation

📌 Author

Bahauddin Rafiuddin