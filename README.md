# 🎓 CampusAI — AI-Powered Smart Campus & Student Success Management System

CampusAI is a full-stack AI/ML-enabled student success management platform designed to help educational institutions monitor academic performance, assess student readiness, identify academic risk, recommend career paths, and provide personalized learning roadmaps.

## 🚀 Live Project

CampusAI is deployed and available for live demonstration.

### 🌐 Production Deployment

- **Live Frontend:** https://campus-ai-henna-ten.vercel.app/
- **Backend API:** https://campusai-server-api.onrender.com
- **ML Service:** https://campusai-vh7r.onrender.com

### 💻 Local Development

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- ML Service: http://127.0.0.1:8000

## ✨ Key Features

- 🔐 JWT-based authentication
- 👥 Role-based access control
- 🎓 Student profile management
- 📚 Academic record management
- 📊 Student readiness analysis
- 💼 Career matching and recommendations
- 🗺️ Personalized learning roadmap
- ✅ Learning progress tracking
- ⚠️ At-risk student detection
- 🔎 Risk reason analysis
- 📈 Admin analytics
- 👨‍🏫 Faculty dashboard
- 🛡️ Student, Faculty and Admin security controls
- 🤖 Python-based Machine Learning service
- 📊 Academic and placement-readiness analytics

## 🏗️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST APIs

### Machine Learning
- Python
- Flask
- Scikit-learn
- Random Forest

### Development Tools
- Git
- GitHub
- npm
- MongoDB

## 🧩 System Modules

### Student Module
- Registration and Login
- Profile Management
- Academic Records
- Readiness Analysis
- Career Matches
- Learning Roadmap
- Learning Progress

### Faculty Module
- Student Monitoring
- Academic Record Viewing
- At-Risk Student Identification
- Student Performance Analysis

### Admin Module
- Campus Overview
- Student and Faculty Statistics
- Branch Analytics
- Semester Analytics
- Risk Analytics
- Risk Reason Summary
- Individual At-Risk Student Monitoring
- Risk Level Classification
## 🏗️ System Architecture

CampusAI follows a modular full-stack architecture where the React frontend communicates with the Node.js/Express backend through REST APIs, while the backend communicates with the Python ML service for machine-learning predictions.

For production deployment, the React frontend is hosted on Vercel, the Node.js/Express backend and Python ML service are hosted on Render, and MongoDB is used as the database layer.

                    ┌─────────────────────────┐
                    │       CampusAI User      │
                    │ Student / Faculty / Admin│
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   React + Vite Frontend  │
                    │         Vercel            │
                    └────────────┬────────────┘
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │   Node.js + Express API  │
                    │         Render            │
                    │                          │
                    │ JWT + RBAC + Business    │
                    │ Logic + Analytics         │
                    └───────┬──────────┬────────┘
                            │          │
                  MongoDB   │          │ ML API
                            ▼          ▼
                 ┌──────────────┐  ┌──────────────┐
                 │   MongoDB    │  │ Python Flask │
                 │    Atlas     │  │ ML Service   │
                 └──────────────┘  │    Render    │
                                   │ Scikit-learn │
                                   │ Random Forest│
                                   └──────────────┘

                                   
## 📁 Project Structure
CampusAI/
│
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── ml-service/
│   ├── app.py
│   └── requirements.txt
│
├── README.md
└── .gitignore

# ⚙️ Installation & Setup
# 1. Clone the Repository
   git clone: https://github.com/amisha8o/CampusAI
   cd CampusAI
# 2. Install Frontend Dependencies
   cd client
   npm install
 # 3. Install Backend Dependencies

Open another terminal:
cd server
npm install
# 4. Configure Backend Environment

Create a .env file inside the server folder.

Use the following structure:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://127.0.0.1:8000

⚠️ Never commit the real .env file or secret credentials to GitHub.

# 5. Install Python ML Dependencies

Open another terminal:

cd ml-service
pip install -r requirements.txt
# ▶️ Running the Project

CampusAI requires three services to run locally.

# Terminal 1 — Frontend
cd client
npm run dev

# Frontend:

http://localhost:5173
# Terminal 2 — Backend
cd server
npm start

# Backend API:

http://localhost:5000
# Terminal 3 — Machine Learning Service
cd ml-service
python app.py

# ML Service:

http://127.0.0.1:8000
# 🔐 Authentication & Authorization

CampusAI uses JWT-based authentication and role-based access control.

Supported Roles
Student
Faculty
Admin

Protected APIs verify the user's JWT token before providing access to role-specific resources.

# 🤖 Machine Learning Module

The ML service is implemented using Python, Flask and Scikit-learn.

The current prototype uses a Random Forest regression model for student readiness experimentation.

ML Inputs
CGPA
Attendance
DSA Score
Aptitude Score
Communication Score
Number of Projects
Number of Internships

The current ML prediction service is intended for project experimentation and educational use. It should not be interpreted as a validated real-world placement prediction model.

# 🧪 Research & Experimentation

CampusAI is being developed as an academic major project with a research-oriented experimentation pipeline.

The research phase will evaluate:

Student readiness indicators
Academic risk detection
Career-skill matching
Learning progress
Machine-learning prediction performance
Baseline comparisons

Experimental results will be documented separately in the research paper.

## 🧪 Testing

CampusAI has been tested across the major application workflows.

### Authentication Testing
- Student registration and login
- JWT token validation
- Protected API access
- Invalid/expired authentication handling

### Role-Based Access Testing
- Student access restrictions
- Faculty-only API protection
- Admin-only API protection
- Unauthorized role access handling

### Functional Testing
- Student profile management
- Academic record creation and deletion
- Readiness analysis
- Career matching
- Learning roadmap
- Learning progress persistence
- Faculty student monitoring
- Admin analytics
- At-risk student detection
- Risk reason analysis
- Risk level classification

### Machine Learning Testing
- ML service health check
- Backend-to-ML service communication
- Authenticated ML prediction endpoint
- Prediction request/response validation

## 📊 Project Status

| Component | Status |
|---|---|
| Student Module | ✅ Complete |
| Faculty Module | ✅ Complete |
| Admin Module | ✅ Complete |
| Authentication & RBAC | ✅ Complete |
| Academic Analytics | ✅ Complete |
| Risk Analytics | ✅ Complete |
| Learning Progress | ✅ Complete |
| ML Integration | ✅ Complete |
| Production Deployment | ✅ Complete |
| UI/UX | ✅ Complete |
| Final Testing | ✅ Complete |
| Research Experiments | 🔄 In Progress |
| Research Paper | 🔄 In Progress |

## ⚠️ Research Disclaimer

CampusAI is an academic and research-oriented prototype developed for educational purposes.

The machine-learning component currently uses experimental data/modeling and should not be considered a validated system for real-world student placement or academic decision-making.

Research claims, performance metrics and experimental conclusions will be reported only after controlled experiments and evaluation.

## 🔮 Future Enhancements

- Real-time notifications
- Advanced recommendation models
- Explainable AI for predictions
- More comprehensive career datasets
- Automated faculty intervention workflows
- Advanced student performance forecasting
- Production-grade monitoring and logging
- Larger real-world datasets for model validation

## 🎯 Project Objectives

CampusAI aims to provide a unified platform for:

- Monitoring student academic performance
- Identifying students requiring additional support
- Understanding student readiness
- Connecting skills with potential career paths
- Providing personalized learning guidance
- Supporting faculty mentoring
- Providing administrators with campus-level analytics
- Exploring machine-learning approaches for student-success analytics

## 👩‍💻 Author

**Amisha Kumari**

B.Tech — Computer Science & Engineering  
Government Mahila Engineering College, Ajmer  
Bikaner Technical University

### Connect

- LinkedIn: https://www.linkedin.com/in/amisha-kumari-3b80aa2b1/
- GitHub: https://github.com/amisha8o

## 📄 License

This project is developed as an academic major project and research-oriented prototype.

---

⭐ If you find CampusAI interesting, feel free to explore the project and its research direction.

### 🔐 Authentication

#### Student Login
<img width="463" height="730" alt="Screenshot 2026-10-08 000940" src="https://github.com/user-attachments/assets/12af3542-f8ba-4e4d-a7b6-80dc8bdaa39f" />


---

### 🎓 Student Dashboard

<img width="1642" height="920" alt="Screenshot 2026-10-08 001026" src="https://github.com/user-attachments/assets/eab2c910-eb7b-480c-a400-7b8eb54e60c9" />


### 📚 Academic Records

<img width="1372" height="605" alt="Screenshot 2026-10-08 001036" src="https://github.com/user-attachments/assets/7a21c2c5-0e28-47f4-946e-694e617ef021" />


### 📊 Readiness Analysis

<img width="1402" height="652" alt="Screenshot 2026-10-08 001120" src="https://github.com/user-attachments/assets/cffb8bc3-9a1c-4353-a3a5-91eb5e474911" />


### 💼 Career Matches

<img width="1621" height="912" alt="Screenshot 2026-10-08 001108" src="https://github.com/user-attachments/assets/c1463e78-5fcc-422c-a9e2-80cd05d017a7" />


### 🗺️ Learning Roadmap

<img width="1341" height="742" alt="Screenshot 2026-10-08 001133" src="https://github.com/user-attachments/assets/4d6d3edb-e1eb-41d0-a0b3-bae8649affbb" />


### 👨‍🏫 Faculty Dashboard

<img width="1642" height="908" alt="Screenshot 2026-10-08 001203" src="https://github.com/user-attachments/assets/4a75384d-5bba-4273-b917-fd966b870ac5" />


### ⚙️ Admin Dashboard

<img width="1637" height="947" alt="Screenshot 2026-10-08 001217" src="https://github.com/user-attachments/assets/25d17a72-02fc-410c-bbc8-478c0b68e7ec" />


### 📈 Admin Analytics

<img width="1326" height="837" alt="image" src="https://github.com/user-attachments/assets/a5a79e7c-e690-4b7c-a356-bab7ce4595f7" />


### ⚠️ Risk Analytics

<img width="1273" height="876" alt="Screenshot 2026-10-08 001246" src="https://github.com/user-attachments/assets/86405189-1a2e-479e-aa3a-3103e94e7ab2" />


---

## 🎥 Project Demo
The live CampusAI deployment is available for demonstration through the production frontend.

A project demonstration video may be added separately.

The demo will cover:

- Student registration and login
- Student profile management
- Academic record management
- Readiness analysis
- Career matching
- Personalized learning roadmap
- Learning progress tracking
- Faculty student monitoring
- At-risk student detection
- Admin analytics
- Risk analysis
- Machine-learning prediction

---
## 🌐 Live Demo

**Frontend:** https://campus-ai-henna-ten.vercel.app/

**Backend API:** https://campusai-server-api.onrender.com

**ML Service:** https://campusai-vh7r.onrender.com

The production deployment has been successfully tested, including frontend authentication, backend API communication, MongoDB connectivity, and backend-to-ML prediction integration.


## 📸 Screenshots & Research Evidence

The following screenshots document the major CampusAI workflows, including student, faculty and admin modules.

Experimental outputs and research results will be included as part of the final project documentation and research paper.

The research results section will contain only experimentally obtained results and verified observations.
   
   
