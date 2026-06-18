# ⚖️ Legal Simplifier

AI-powered legal document analysis platform built with the MERN stack and Groq AI.

Legal Simplifier helps users upload legal PDFs and receive simplified explanations, risk analysis, key clauses, and AI-powered question answering in plain English.

---

## 🚀 Features

### 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### 📄 Legal Document Analysis

* Upload PDF documents
* Extract text from PDFs
* AI-powered legal document understanding
* Document classification

### 🤖 AI Analysis

* Simplified explanation of legal documents
* Key points extraction
* Risk clause detection
* Risk scoring (0–10)
* Important dates extraction
* Party names identification
* Overall risk summary

### 💬 AI Legal Assistant

* Ask questions about uploaded documents
* Context-aware document chat
* Simple and understandable answers

### 📚 Document History

* View previously analyzed documents
* Open detailed reports
* Review risk analysis anytime

---

## 🏗️ Architecture

### Frontend (React + Vite)

* Login / Register
* Dashboard
* PDF Upload Interface
* Drag & Drop Support
* Document Analysis View
* Risk Clause Panel
* AI Chat Assistant
* Document History

### Backend (Node.js + Express)

#### Authentication APIs

* POST `/api/auth/register`
* POST `/api/auth/login`

#### Legal APIs

* POST `/api/legal/upload`
* POST `/api/legal/ask`
* GET `/api/legal/history`
* GET `/api/legal/doc/:id`

#### Services

* JWT Authentication Middleware
* PDF Parsing Service
* Groq AI Service
* Multer File Upload Middleware

### Database

MongoDB Atlas

Collections:

#### Users

* name
* email
* password

#### LegalDocs

* fileName
* originalText
* simplifiedText
* docType
* riskClauses
* riskScore
* riskSummary
* partyNames
* importantDates
* chatHistory

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Vite

### Backend

* Node.js
* Express.js
* JWT
* Multer
* pdf-parse

### Database

* MongoDB Atlas
* Mongoose

### AI

* Groq API
* Llama 3.3 70B Versatile

---

## 📂 Project Structure

```text
legal-simplifier/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── LegalDoc.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── legal.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── services/
│   │   ├── pdfService.js
│   │   └── groqService.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── Navbar.jsx
        │   └── RiskBadge.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Analyser.jsx
        │   └── DocDetail.jsx
        └── App.jsx
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Ajeet-yaduvanshi/legal-simplifier.git
cd legal-simplifier
```

### Install Dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

### Run Project

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

## 🎯 Supported Document Types

* Rent Agreement
* Employment Contract
* NDA
* Service Agreement
* Court Notice
* Affidavit
* Legal Contracts

---

## 📌 Future Improvements

* OCR Support for Scanned PDFs
* Multi-language Analysis
* AI-generated Legal Recommendations
* Export Analysis to PDF
* Admin Dashboard
* Email Notifications

---

## 👨‍💻 Author

**Ajeet Yadav**

B.Tech Computer Science Engineering

GitHub:
https://github.com/Ajeet-yaduvanshi

---

## ⚠️ Disclaimer

This project provides AI-generated legal document analysis for educational and informational purposes only.

It is not a substitute for professional legal advice from a qualified lawyer.

