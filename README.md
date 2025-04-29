# 🏥 PH HealthCare – Server

**PH HealthCare** is a backend system for a robust healthcare management web application. It is built to simplify and secure the interactions between patients, doctors, and administrators. This repository handles APIs, authentication, appointment management, real-time communication (via WebRTC), medical data processing, and more.

---

## Tech Stack

- **Node.js** – Server runtime
- **Express.js** – Web framework
- **Prisma** – Type-safe ORM for PostgreSQL
- **PostgreSQL** – Relational database
- **JWT** – Authentication & authorization
- **Agora.io (WebRTC)** – Real-time communication between doctors and patients
- **Nodemailer** – Emailing system for prescriptions and notifications

## Features

### ✅ Admin
- Create and manage doctor accounts
- Create, update, and cancel appointment slots
- Access metadata, doctor profiles, and appointment history

### ✅ Doctor
- Set and manage appointment slots
- View upcoming appointments
- Access patient medical history, reports, and previous prescriptions
- Generate and email prescriptions with custom notes

### ✅ Patient
- Register and manage account
- Book appointments with doctors
- Upload diagnostic test reports
- View prescription history
- Pay securely for consultations
- Leave ratings and reviews for doctors

### 🔁 General
- Real-time video consultations with WebRTC (Agora.io)
- Secure role-based authentication and authorization (JWT)
- Auto-cancel unpaid appointments after 30 minutes
- Email notifications for bookings, invoices, and prescriptions

## Installation and Setup
- Clone this repository: `git clone https://github.com/mdnoyonhossain/PH-HealthCare-Server`
- Install dependencies: `npm install`
- Set up the environment variables by creating a `.env` file and filling in the required variables based on the provided `.env.example` file.
- Run the database migrations: `npx prisma migrate dev`
- Run the Command: `npm run seed`
- Start the server: `npm run dev`

### API Documentation: [POSTMAN API DOCUMENTATION (Click Here)](https://documenter.getpostman.com/view/31204344/2sB2j3BBWG)