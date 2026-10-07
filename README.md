# CampusAI — AI-Powered Smart Campus & Student Success Management System

A runnable full-stack major-project starter with:
- React + Vite frontend
- Node.js + Express REST API
- MongoDB persistence
- JWT authentication and role-based access
- Student profile, readiness score, career recommendations, learning roadmap
- Optional Python Flask + scikit-learn ML service

> Important: The ML service uses a small synthetic demonstration dataset. Do not present its output as validated real-world accuracy. Replace the demo dataset with an approved, representative dataset and evaluate it before making research claims.

## Prerequisites
- Node.js 20+ and npm
- MongoDB running locally OR a MongoDB Atlas connection string
- Python 3.10+ only if running the optional ML service

## 1. Start the backend
Open a terminal in `server/`:

```bash
npm install
```

Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET` if needed.

```bash
npm run dev
```

Backend: http://localhost:5000  
Health check: http://localhost:5000/api/health

Default local MongoDB URI:
`mongodb://127.0.0.1:27017/campus_ai`

## 2. Start the frontend
Open a second terminal in `client/`:

```bash
npm install
npm run dev
```

Open the Vite URL shown in terminal (normally http://localhost:5173).

## 3. Optional Python ML service
Open a third terminal in `ml-service/`:

Windows:
```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

macOS/Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

ML health check: http://localhost:8000/health

## Demo workflow
1. Register a new student account.
2. Log in.
3. Update CGPA, attendance, skills, projects, internships, DSA/aptitude/communication scores.
4. Open Readiness, Career Matches, and Learning Roadmap.

## Notes
- The faculty and admin screens are role-restricted API routes; create users with those roles manually only in a trusted development database, or add a protected admin-creation workflow before production.
- Never commit `.env`, secrets, real student data, or passwords.
- This is a project starter. Test and improve it with your project guide before submission.
