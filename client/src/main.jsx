import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = "http://localhost:5000/api";

const emptyProfile = {
  branch: "Computer Science and Engineering",
  semester: 7,
  cgpa: 0,
  attendance: 0,
  targetRole: "Software Developer",
  skills: [],
  certifications: [],
  projects: 0,
  internships: 0,
  dsaScore: 0,
  aptitudeScore: 0,
  communicationScore: 0
};

async function api(path, token, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}),
      ...(options.headers || {})
    }
  });

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  return data;
}

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("campusai_token") || ""
  );

  const [user, setUser] = useState(null);

  const [view, setView] =
    useState("Dashboard");

  const [mode, setMode] =
    useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [profile, setProfile] =
    useState(emptyProfile);

  const [readiness, setReadiness] =
    useState(null);

  const [mlPrediction, setMlPrediction] =
    useState(null);

  const [mlLoading, setMlLoading] =
    useState(false);

  const [careers, setCareers] =
    useState([]);

  const [roadmap, setRoadmap] =
    useState([]);

  const [learningProgress, setLearningProgress] = useState({});

  const [message, setMessage] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  /* =====================================================
     ACADEMIC STATE
     ===================================================== */

  const [academicRecords, setAcademicRecords] =
    useState([]);
const [activeLearningSkill, setActiveLearningSkill] = useState(null);
const [completedLearningItems, setCompletedLearningItems] = useState({});

  const [academicLoading, setAcademicLoading] =
    useState(false);

  const [academicForm, setAcademicForm] =
    useState({
      semester: "",
      subject: "",
      marks: "",
      attendance: "",
      credits: "3",
      grade: ""
    });

    /* =====================================================
   FACULTY STATE
   ===================================================== */

const [facultyStudents, setFacultyStudents] =
  useState([]);
const [adminStats, setAdminStats] = useState(null);
const [adminAnalytics, setAdminAnalytics] = useState(null);
const [analyticsLoading, setAnalyticsLoading] = useState(false);
const [adminStudents, setAdminStudents] = useState([]);
const [adminLoading, setAdminLoading] = useState(false);

const [atRiskStudents, setAtRiskStudents] =
  useState([]);

const [selectedStudent, setSelectedStudent] =
  useState(null);

const [selectedStudentRecords, setSelectedStudentRecords] =
  useState([]);

const [facultyLoading, setFacultyLoading] =
  useState(false);

  /* =====================================================
     LOAD DASHBOARD
     ===================================================== */

  async function loadDashboard(t = token) {
    const me =
      await api("/profile", t);

    setUser(me.user);

    setProfile({
      ...emptyProfile,
      ...me.user.profile,
      skills:
        me.user.profile?.skills || [],
      certifications:
        me.user.profile?.certifications || []
    });

    const [
      r,
      c,
      rm,
      academic
    ] = await Promise.all([
      api(
        "/analytics/readiness",
        t
      ),
      api(
        "/analytics/careers",
        t
      ),
      api(
        "/analytics/roadmap",
        t
      ),
      api(
        "/academic",
        t
      )
    ]);

    setReadiness(r);

    setCareers(
      Array.isArray(c) ? c : c.matches || []
    );

    setRoadmap(
      rm.roadmap || []
    );

    setAcademicRecords(
      academic || []
    );
  }

  function getSkillPriority(skill) {
  const highPriority = [
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Python",
    "Java",
    "Data Structures",
    "DSA"
  ];

  const mediumPriority = [
    "REST APIs",
    "MySQL",
    "Git",
    "GitHub",
    "HTML",
    "CSS"
  ];

  const normalizedSkill = skill.trim().toLowerCase();

  if (
    highPriority.some(
      (item) =>
        item.toLowerCase() === normalizedSkill
    )
  ) {
    return "High Priority";
  }

  if (
    mediumPriority.some(
      (item) =>
        item.toLowerCase() === normalizedSkill
    )
  ) {
    return "Medium Priority";
  }

  return "Recommended";
}

function getSkillPriorityReason(skill) {
  const highPriority = [
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Python",
    "Java",
    "Data Structures",
    "DSA"
  ];

  const mediumPriority = [
    "REST APIs",
    "MySQL",
    "Git",
    "GitHub",
    "HTML",
    "CSS"
  ];

  const normalizedSkill = skill.trim().toLowerCase();

  if (
    highPriority.some(
      (item) =>
        item.toLowerCase() === normalizedSkill
    )
  ) {
    return "Core skill for your target role";
  }

  if (
    mediumPriority.some(
      (item) =>
        item.toLowerCase() === normalizedSkill
    )
  ) {
    return "Important supporting skill";
  }

  return "Useful skill to strengthen";
}

function getSkillLearningPlan(skill) {
  const plans = {
    javascript: [
      "JavaScript Fundamentals",
      "ES6+ Features",
      "Promises & Async/Await",
      "DOM & Events"
    ],

    react: [
      "React Fundamentals",
      "Components & Props",
      "Hooks",
      "React Router"
    ],

    "node.js": [
      "Node.js Fundamentals",
      "Express.js",
      "REST APIs",
      "Authentication with JWT"
    ],

    express: [
      "Express.js Fundamentals",
      "REST API Development",
      "Middleware",
      "Error Handling"
    ],

    mongodb: [
      "MongoDB Fundamentals",
      "CRUD Operations",
      "Schema Design",
      "MongoDB with Node.js"
    ],

    python: [
      "Python Fundamentals",
      "Functions & OOP",
      "NumPy & Pandas",
      "Python for AI/ML"
    ],

    java: [
      "Java Fundamentals",
      "OOP",
      "Collections Framework",
      "Exception Handling"
    ],

    dsa: [
      "Arrays & Hashing",
      "Strings & Sliding Window",
      "Linked Lists",
      "Trees & Graphs"
    ],

    "data structures": [
      "Arrays & Hashing",
      "Linked Lists",
      "Stacks & Queues",
      "Trees & Graphs"
    ],

    "rest api": [
      "HTTP Fundamentals",
      "REST API Concepts",
      "API Authentication",
      "API Testing"
    ],

    "rest apis": [
      "HTTP Fundamentals",
      "REST API Concepts",
      "API Authentication",
      "API Testing"
    ],

    mysql: [
      "SQL Fundamentals",
      "Joins",
      "Subqueries",
      "Database Design"
    ],

    git: [
      "Git Fundamentals",
      "Branching",
      "Merge & Rebase",
      "Git Workflow"
    ],

    github: [
      "Repositories",
      "Branches & Pull Requests",
      "GitHub Collaboration",
      "Project Documentation"
    ],

    html: [
      "HTML Fundamentals",
      "Semantic HTML",
      "Forms",
      "Accessibility"
    ],

    css: [
      "CSS Fundamentals",
      "Flexbox",
      "CSS Grid",
      "Responsive Design"
    ]
  };

  return (
    plans[skill.trim().toLowerCase()] || [
      `Learn ${skill} Fundamentals`,
      `Practice ${skill} with small projects`,
      `Build one project using ${skill}`,
      `Revise and practice interview questions`
    ]
  );
}

  /* =====================================================
   FACULTY DATA
   ===================================================== */

async function loadFacultyData(t = token) {
  setFacultyLoading(true);
  setMessage("");

  try {
    const [
      students,
      atRisk
    ] = await Promise.all([
      api(
        "/faculty/students",
        t
      ),
      api(
        "/faculty/at-risk",
        t
      )
    ]);

    setFacultyStudents(
      students || []
    );

    setAtRiskStudents(
      atRisk || []
    );
  } catch (error) {
    setMessage(error.message);
  } finally {
    setFacultyLoading(false);
  }
}

async function loadAdminData() {
  setAdminLoading(true);
  setMessage("");

  try {
    const analytics = await api(
  "/admin/analytics",
  token
);

setAdminAnalytics({
  ...analytics,

  branchWise: Object.entries(
    analytics.branchStats || {}
  ).map(([branch, data]) => ({
    branch,
    ...data
  })),

  semesterWise: Object.entries(
    analytics.semesterStats || {}
  ).map(([semester, data]) => ({
    semester,
    ...data
  }))
});

  } catch (error) {
    setMessage(error.message);
  } finally {
    setAdminLoading(false);
  }
}


async function viewStudentAcademic(
  studentId,
  t = token
) {
  setMessage("");

  try {
    const records = await api(
      `/faculty/academic/${studentId}`,
      t
    );

    setSelectedStudentRecords(
      records || []
    );
  } catch (error) {
    setMessage(error.message);
  }
}

  useEffect(() => {
    if (token) {
      loadDashboard().catch(e => {
        setMessage(e.message);
        logout();
      });
    }
  }, []);

  /* =====================================================
     LOGOUT
     ===================================================== */

  function logout() {
    localStorage.removeItem(
      "campusai_token"
    );

    setToken("");
    setUser(null);
    setReadiness(null);
    setAcademicRecords([]);
    

    setFacultyStudents([]);
    setAtRiskStudents([]);
    setSelectedStudent(null);
   setSelectedStudentRecords([]);

   setMessage("");
  }

  /* =====================================================
     AUTH
     ===================================================== */

  async function submitAuth(e) {
    e.preventDefault();

    setBusy(true);
    setMessage("");

    try {
      const result =
        await api(
          `/auth/${
            mode === "login"
              ? "login"
              : "register"
          }`,
          "",
          {
            method: "POST",
            body: JSON.stringify(form)
          }
        );

      localStorage.setItem(
        "campusai_token",
        result.token
      );

      setToken(result.token);
      setUser(result.user);

      await loadDashboard(
        result.token
      );

      setMessage(
        "Welcome to CampusAI!"
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  /* =====================================================
     PROFILE
     ===================================================== */

  async function saveProfile(e) {
    e.preventDefault();

    setBusy(true);
    setMessage("");

    const payload = {
      ...profile,

      skills:
        typeof profile.skills === "string"
          ? profile.skills
              .split(",")
              .map(s => s.trim())
              .filter(Boolean)
          : profile.skills,

      certifications:
        typeof profile.certifications ===
        "string"
          ? profile.certifications
              .split(",")
              .map(s => s.trim())
              .filter(Boolean)
          : profile.certifications
    };

    try {
      await api(
        "/profile",
        token,
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          )
        }
      );

      await loadDashboard();

      setMessage(
        "Profile saved successfully."
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  /* =====================================================
     ML PREDICTION
     ===================================================== */

  async function runMLPrediction() {
    setMlLoading(true);
    setMlPrediction(null);
    setMessage("");

    try {
      const result =
        await api(
          "/analytics/ml-prediction",
          token,
          {
            method: "POST",
            body: JSON.stringify({})
          }
        );

      setMlPrediction(result);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setMlLoading(false);
    }
  }

  async function toggleLearningItem(skill, index) {
  const key = `${skill}-${index}`;

  const newCompleted = !completedLearningItems[key];

  setCompletedLearningItems((prev) => ({
    ...prev,
    [key]: newCompleted
  }));

  try {
    const currentProgress = await api(
      `/learning-progress/${encodeURIComponent(skill)}`,
      token
    );

    let completedItems = Array.isArray(
      currentProgress.completedItems
    )
      ? [...currentProgress.completedItems]
      : [];

    if (newCompleted) {
      if (!completedItems.includes(index)) {
        completedItems.push(index);
      }
    } else {
      completedItems = completedItems.filter(
        (item) => item !== index
      );
    }

    await api(
      `/learning-progress/${encodeURIComponent(skill)}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({
          completedItems
        })
      }
    );

    setLearningProgress((prev) => ({
      ...prev,
      [skill]: completedItems
    }));
  } catch (error) {
    setMessage(error.message);

    setCompletedLearningItems((prev) => ({
      ...prev,
      [key]: !newCompleted
    }));
  }
}

async function loadLearningProgress(skill) {
  try {
    const result = await api(
      `/learning-progress/${encodeURIComponent(skill)}`,
      token
    );

    const completedItems = Array.isArray(result.completedItems)
      ? result.completedItems
      : [];

    setLearningProgress((prev) => ({
      ...prev,
      [skill]: completedItems
    }));

    setCompletedLearningItems((prev) => {
      const updated = { ...prev };

      completedItems.forEach((index) => {
        updated[`${skill}-${index}`] = true;
      });

      return updated;
    });
  } catch (error) {
    setMessage(error.message);
  }
}

  /* =====================================================
     ADD ACADEMIC RECORD
     ===================================================== */

  async function addAcademicRecord(e) {
    e.preventDefault();

    setAcademicLoading(true);
    setMessage("");

    try {
      await api(
        "/academic",
        token,
        {
          method: "POST",

          body: JSON.stringify({
            semester:
              Number(
                academicForm.semester
              ),

            subject:
              academicForm.subject,

            marks:
              Number(
                academicForm.marks
              ),

            attendance:
              Number(
                academicForm.attendance
              ),

            credits:
              Number(
                academicForm.credits
              ),

            grade:
              academicForm.grade
          })
        }
      );

      setAcademicForm({
        semester: "",
        subject: "",
        marks: "",
        attendance: "",
        credits: "3",
        grade: ""
      });

      const records =
        await api(
          "/academic",
          token
        );

      setAcademicRecords(
        records
      );

      setMessage(
        "Academic record added successfully."
      );
    } catch (error) {
      setMessage(
        error.message
      );
    } finally {
      setAcademicLoading(
        false
      );
    }
  }

  /* =====================================================
     DELETE ACADEMIC RECORD
     ===================================================== */

  async function deleteAcademicRecord(
    id
  ) {
    try {
      await api(
        `/academic/${id}`,
        token,
        {
          method: "DELETE"
        }
      );

      setAcademicRecords(
        academicRecords.filter(
          record =>
            record._id !== id
        )
      );

      setMessage(
        "Academic record deleted successfully."
      );
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  const update = (
    key,
    value
  ) =>
    setProfile(p => ({
      ...p,
      [key]: value
    }));

  /* =====================================================
     AUTH SCREEN
     ===================================================== */

  if (!token || !user) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">

          <div className="brand-mark">
            CA
          </div>

          <p className="eyebrow">
            STUDENT SUCCESS PLATFORM
          </p>

          <h1>
            CampusAI
          </h1>

          <p className="muted">
            Your academics, skills and
            career readiness in one place.
          </p>

          <div className="tabs">

            <button
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode("login")
              }
            >
              Login
            </button>

            <button
              className={
                mode === "register"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode("register")
              }
            >
              Create account
            </button>

          </div>

          <form
            onSubmit={submitAuth}
            className="form-stack"
          >

            {mode === "register" && (
              <label>
                Full name

                <input
                  required
                  value={form.name}
                  onChange={e =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  placeholder="Your name"
                />
              </label>
            )}

            <label>
              Email

              <input
                type="email"
                required
                value={form.email}
                onChange={e =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password

              <input
                type="password"
                minLength="8"
                required
                value={form.password}
                onChange={e =>
                  setForm({
                    ...form,
                    password:
                      e.target.value
                  })
                }
                placeholder="At least 8 characters"
              />
            </label>

            <button
              className="primary full"
              disabled={busy}
            >
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Log in"
                  : "Create student account"}
            </button>

          </form>

          {message && (
            <p className="notice">
              {message}
            </p>
          )}

          <p className="tiny">
            Development build · Use
            your own account details.
          </p>

        </div>
      </div>
    );
  }

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const nav = [
  "Dashboard",
  "Academic",
  "My Profile",
  "Career Matches",
  "Readiness",
  "Learning Roadmap",
  ...(
    ["faculty", "admin"].includes(user?.role)
      ? ["Faculty Dashboard"]
      : []
  ),
  ...(
    user?.role === "admin"
      ? ["Admin"]
      : []
  )
];

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">

          <span className="brand-mark small">
            CA
          </span>

          <span>
            CampusAI
            <small>
              STUDENT SUCCESS
            </small>
          </span>

        </div>

        <div className="side-label">
          WORKSPACE
        </div>

        {nav.map(n => (
  <button
    key={n}
    className={`nav-item ${
      view === n
        ? "selected"
        : ""
    }`}

    onClick={() => {
      setView(n);

      if (n === "Faculty Dashboard") {
        setSelectedStudent(null);
        setSelectedStudentRecords([]);
        loadFacultyData();
      }

      if (n === "Admin") {
        loadAdminData();
      }
    }}
  >
    {
      {
        Dashboard: "▦",
        Academic: "▤",
        "My Profile": "◉",
        "Career Matches": "✦",
        Readiness: "◷",
        "Learning Roadmap": "☷",
        "Faculty Dashboard": "♙",
        "Admin": "⚙"
      }[n]
    }

    <span>
      {n}
    </span>

  </button>
))}


        <div className="sidebar-bottom">

          <div className="avatar">
            {user.name
              ?. [0]
              ?.toUpperCase()}
          </div>

          <div className="user-mini">
            <b>
              {user.name}
            </b>

            <small>
              {user.role}
            </small>
          </div>
           <button
             className="logout"
             onClick={logout}
             title="Logout"
            >
              Logout
            </button>

   

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>

            <p className="eyebrow">
              CAMPUSAI /{" "}
              {view.toUpperCase()}
            </p>

            <h2>
              {view === "Dashboard"
                ? `Welcome back, ${
                    user.name.split(
                      " "
                    )[0]
                  }`
                : view}
            </h2>

          </div>

          <span className="status-pill">
            <i></i>
            API workspace
          </span>

        </header>

        {message && (
          <div
            className="notice dismiss"
            onClick={() =>
              setMessage("")
            }
          >
            {message}
            <b>×</b>
          </div>
        )}

        {/* =================================================
            DASHBOARD
            ================================================= */}

        {view === "Dashboard" && (
          <>
            <section className="hero">

              <div>

                <p className="eyebrow light">
                  YOUR GROWTH,
                  VISUALIZED
                </p>

                <h3>
                  Small steps.
                  Stronger outcomes.
                </h3>

                <p>
                  Track academic progress,
                  strengthen skills, and
                  prepare for your next
                  opportunity.
                </p>

                <button
                  className="light-button"
                  onClick={() =>
                    setView(
                      "My Profile"
                    )
                  }
                >
                  Update my profile ↗
                </button>

              </div>

              <div className="hero-orbit">

                <div className="orbit-core">
                  AI
                </div>

                <span className="orbit-dot dot1"></span>
                <span className="orbit-dot dot2"></span>
                <span className="orbit-dot dot3"></span>

              </div>

            </section>

            <div className="section-heading">

              <div>

                <h3>
                  At a glance
                </h3>

                <p className="muted">
                  Based on your current
                  profile information
                </p>

              </div>

            </div>

            <div className="metric-grid">

              <Metric
                title="CGPA"
                value={`${Number(
                  profile.cgpa || 0
                ).toFixed(2)}/10`}
                icon="◈"
                hint="Academic performance"
              />

              <Metric
                title="Attendance"
                value={`${profile.attendance || 0}%`}
                icon="◷"
                hint="Class participation"
              />

              <Metric
                title="Readiness score"
                value={`${readiness?.score ?? 0}%`}
                icon="✦"
                hint={
                  readiness?.band ||
                  "Add profile details"
                }
              />

              <Metric
                title="Skills listed"
                value={
                  profile.skills
                    ?.length || 0
                }
                icon="⌘"
                hint="Skills in your profile"
              />

            </div>

            <div className="two-col">

              <section className="panel">

                <div className="panel-title">

                  <h3>
                    Career matches
                  </h3>

                  <button
                    className="text-button"
                    onClick={() =>
                      setView(
                        "Career Matches"
                      )
                    }
                  >
                    View all ↗
                  </button>

                </div>

                {careers
                  .slice(0, 3)
                  .map(c => (
                    <div
                      className="match-row"
                      key={c.role}
                    >

                      <div className="role-icon">
                        ✦
                      </div>

                      <div className="match-info">

                        <b>
                          {c.role}
                        </b>

                        <small>
                          {
                            c.matchedSkills
                              .length
                          }{" "}
                          of{" "}
                          {
                            c.matchedSkills
                              .length +
                            c.missingSkills
                              .length
                          }{" "}
                          skills matched
                        </small>

                        <div className="progress">

                          <span
                            style={{
                              width: `${c.matchPercent}%`
                            }}
                          ></span>

                        </div>

                      </div>

                      <strong>
                        {c.matchPercent}%
                      </strong>

                    </div>
                  ))}

              </section>

              <section className="panel">

                <div className="panel-title">

                  <h3>
                    Next steps
                  </h3>

                  <span className="tiny">
                    PERSONAL PLAN
                  </span>

                </div>

                {roadmap
                  .slice(0, 3)
                  .map(r => (
                    <div
                      className="task-row"
                      key={r.week}
                    >

                      <span className="task-number">
                        0{r.week}
                      </span>

                      <div>

                        <b>
                          {r.title}
                        </b>

                        <small>
                          {r.action}
                        </small>

                      </div>

                    </div>
                  ))}

              </section>

            </div>
          </>
        )}

        {/* =================================================
            ACADEMIC
            ================================================= */}

        {view === "Academic" && (
          <div className="two-col">

            <section className="panel">

              <p className="eyebrow">
                ACADEMIC DATA
              </p>

              <h2>
                Academic Performance
              </h2>

              <p className="muted">
                Add semester-wise subject
                performance and attendance.
              </p>

              <form
                onSubmit={
                  addAcademicRecord
                }
                className="form-grid"
              >

                <div>

                  <label>
                    Semester
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={
                      academicForm.semester
                    }
                    onChange={e =>
                      setAcademicForm({
                        ...academicForm,
                        semester:
                          e.target.value
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label>
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="Data Structures"
                    value={
                      academicForm.subject
                    }
                    onChange={e =>
                      setAcademicForm({
                        ...academicForm,
                        subject:
                          e.target.value
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label>
                    Marks
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      academicForm.marks
                    }
                    onChange={e =>
                      setAcademicForm({
                        ...academicForm,
                        marks:
                          e.target.value
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label>
                    Attendance %
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      academicForm.attendance
                    }
                    onChange={e =>
                      setAcademicForm({
                        ...academicForm,
                        attendance:
                          e.target.value
                      })
                    }
                    required
                  />

                </div>

                <div>

                  <label>
                    Credits
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={
                      academicForm.credits
                    }
                    onChange={e =>
                      setAcademicForm({
                        ...academicForm,
                        credits:
                          e.target.value
                      })
                    }
                  />

                </div>

                <div>

                  <label>
                    Grade
                  </label>

                  <input
                    type="text"
                    placeholder="A+"
                    value={
                      academicForm.grade
                    }
                    onChange={e =>
                      setAcademicForm({
                        ...academicForm,
                        grade:
                          e.target.value
                      })
                    }
                  />

                </div>

                <button
                  className="primary"
                  type="submit"
                  disabled={
                    academicLoading
                  }
                >
                  {academicLoading
                    ? "Adding..."
                    : "Add Academic Record"}
                </button>

              </form>

            </section>

            <section className="panel">

              <p className="eyebrow">
                RECORDS
              </p>

              <h2>
                My Academic Records
              </h2>

              {academicRecords.length ===
              0 ? (
                <p className="muted">
                  No academic records
                  added yet.
                </p>
              ) : (
                <div className="academic-records">

                  {academicRecords.map(
                    record => (
                      <div
                        className="record-card"
                        key={record._id}
                      >

                        <div>

                          <strong>
                            {record.subject}
                          </strong>

                          <p>
                            Semester{" "}
                            {record.semester}{" "}
                            ·{" "}
                            {record.credits}{" "}
                            credits
                          </p>

                        </div>

                        <div>

                          <strong>
                            {record.marks}/100
                          </strong>

                          <p>
                            Attendance:{" "}
                            {
                              record.attendance
                            }%
                          </p>

                        </div>

                        <div>

                          <span>
                            {
                              record.grade ||
                              "—"
                            }
                          </span>

                        </div>

                        <button
                          className="danger"
                          onClick={() =>
                            deleteAcademicRecord(
                              record._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>

          </div>
        )}
{/* =================================================
    FACULTY DASHBOARD
    ================================================= */}

{view === "Faculty Dashboard" && (
  <>
    <section className="panel">
      <p className="eyebrow">
        FACULTY PORTAL
      </p>

      <h2>
        Student Monitoring
      </h2>

      <p className="muted">
        Monitor student academic performance,
        attendance and placement-readiness
        indicators from one workspace.
      </p>

      <button
        className="primary"
        onClick={() => loadFacultyData()}
        disabled={facultyLoading}
      >
        {facultyLoading
          ? "Refreshing..."
          : "Refresh Student Data"}
      </button>
    </section>

    <div className="metric-grid">
      <Metric
        title="Total Students"
        value={facultyStudents.length}
        icon="♙"
        hint="Registered student accounts"
      />

      <Metric
        title="At-Risk Students"
        value={atRiskStudents.length}
        icon="!"
        hint="Baseline warning criteria"
      />

      <Metric
        title="Students Monitored"
        value={facultyStudents.length}
        icon="◉"
        hint="Available for monitoring"
      />

      <Metric
        title="Selected Student"
        value={
          selectedStudent
            ? "1"
            : "0"
        }
        icon="◆"
        hint="Currently viewing"
      />
    </div>

    <div className="two-col">

      {/* STUDENT LIST */}

      <section className="panel">

        <div className="panel-title">

          <div>
            <p className="eyebrow">
              STUDENTS
            </p>

            <h3>
              Student Directory
            </h3>
          </div>

          <span className="tiny">
            {facultyStudents.length} TOTAL
          </span>

        </div>

        {facultyLoading ? (
          <p className="muted">
            Loading students...
          </p>
        ) : facultyStudents.length === 0 ? (
          <p className="muted">
            No students found.
          </p>
        ) : (
          <div className="academic-records">

            {facultyStudents.map(
              student => (
                <div
                  className="record-card"
                  key={student.id}
                >

                  <div>
                    <strong>
                      {student.name}
                    </strong>

                    <p>
                      {student.email}
                    </p>
                  </div>

                  <div>
                    <strong>
                      CGPA
                    </strong>

                    <p>
                      {student.profile?.cgpa ??
                        "—"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Attendance
                    </strong>

                    <p>
                      {student.profile?.attendance ??
                        "—"}%
                    </p>
                  </div>

                  <button
                    className="primary"
                    onClick={() => {
                      setSelectedStudent(
                        student
                      );

                      viewStudentAcademic(
                        student.id
                      );
                    }}
                  >
                    View
                  </button>

                </div>
              )
            )}

          </div>
        )}


      </section>


      {/* AT-RISK */}

      <section className="panel">

        <div className="panel-title">

          <div>
            <p className="eyebrow">
              EARLY WARNING
            </p>

            <h3>
              At-Risk Students
            </h3>
          </div>

          <span className="tiny">
            BASELINE
          </span>

        </div>

        <p className="muted">
          Students meeting at least one
          academic or readiness warning
          condition.
        </p>

        {atRiskStudents.length === 0 ? (
          <div className="notice">
            No students currently meet
            the baseline risk criteria.
          </div>
        ) : (
          <div className="academic-records">

            {atRiskStudents.map(
              student => (
                <div
                  className="record-card"
                  key={student.id}
                >

                  <div>
                    <strong>
                      {student.name}
                    </strong>

                    <p>
                      {student.email}
                    </p>
                  </div>

                  <div>
                    <span className="chip">
                      CGPA{" "}
                      {student.profile?.cgpa ??
                        "—"}
                    </span>
                  </div>

                  <div>
                    <span className="chip">
                      Attendance{" "}
                      {student.profile?.attendance ??
                        "—"}%
                    </span>
                  </div>

                  <button
                    className="primary"
                    onClick={() => {
                      setSelectedStudent(
                        student
                      );

                      viewStudentAcademic(
                        student.id
                      );
                    }}
                  >
                    View
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>


    {/* SELECTED STUDENT */}

    {selectedStudent && (
      <section
        className="panel wide-panel"
        style={{
          marginTop: "20px"
        }}
      >

        <div className="panel-title">

          <div>

            <p className="eyebrow">
              STUDENT DETAILS
            </p>

            <h2>
              {selectedStudent.name}
            </h2>

            <p className="muted">
              {selectedStudent.email}
            </p>

          </div>

          <button
            className="text-button"
            onClick={() => {
              setSelectedStudent(null);
              setSelectedStudentRecords([]);
            }}
          >
            Close ×
          </button>

        </div>


        {/* PROFILE SUMMARY */}

        <div className="metric-grid">

          <Metric
            title="CGPA"
            value={
              selectedStudent.profile?.cgpa ??
              "—"
            }
            icon="◈"
            hint="Academic performance"
          />

          <Metric
            title="Attendance"
            value={
              `${selectedStudent.profile?.attendance ?? "—"}%`
            }
            icon="◷"
            hint="Overall attendance"
          />

          <Metric
            title="DSA Score"
            value={
              `${selectedStudent.profile?.dsaScore ?? "—"}%`
            }
            icon="⌘"
            hint="Problem-solving indicator"
          />

          <Metric
            title="Aptitude"
            value={
              `${selectedStudent.profile?.aptitudeScore ?? "—"}%`
            }
            icon="✦"
            hint="Aptitude indicator"
          />

        </div>


        {/* ACADEMIC RECORDS */}

        <div
          className="section-heading"
          style={{
            marginTop: "24px"
          }}
        >

          <div>

            <h3>
              Academic Records
            </h3>

            <p className="muted">
              Semester-wise subject
              performance.
            </p>

          </div>

        </div>


        {selectedStudentRecords.length === 0 ? (
          <p className="muted">
            No academic records available
            for this student.
          </p>
        ) : (
          <div className="academic-records">

            {selectedStudentRecords.map(
              record => (
                <div
                  className="record-card"
                  key={record._id}
                >

                  <div>
                    <strong>
                      {record.subject}
                    </strong>

                    <p>
                      Semester{" "}
                      {record.semester}
                      {" · "}
                      {record.credits}
                      {" credits"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      {record.marks}/100
                    </strong>

                    <p>
                      Attendance:{" "}
                      {record.attendance}%
                    </p>
                  </div>

                  <div>
                    <span>
                      Grade:{" "}
                      {record.grade || "—"}
                    </span>
                  </div>

                </div>
              )
            )}

          </div>
        )}

      </section>
    )}

  </>
)}

{view === "Admin" && (
  <div className="admin-page">

    {/* ================= ADMIN HEADER ================= */}
    <section className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-left">
          <div className="admin-label">CAMPUSAI / ADMIN</div>

          <h1 className="admin-title">
            Your Campus, Visualized
          </h1>

          <p className="admin-description">
            Monitor academic performance, student readiness, faculty activity
            and academic risk from one centralized workspace.
          </p>

          <div className="admin-live">
            <span>●</span> LIVE ANALYTICS
          </div>
        </div>

        <div className="admin-api">
          <span className="admin-api-label">API WORKSPACE</span>
          <strong>Admin Analytics</strong>
          <small>Centralized campus performance monitoring</small>
          <div className="admin-api-status">
            ✓ Analytics workspace active
          </div>
        </div>
      </div>
    </section>


    {adminLoading ? (
      <div className="admin-section">
        <div className="admin-empty">
          Loading campus analytics...
        </div>
      </div>
    ) : (
      <>

       {/* ================= OVERVIEW ================= */}
<section className="admin-section">

  <div className="admin-section-head">
    <div>
      <div className="admin-section-label">
        AT A GLANCE
      </div>

      <h2 className="admin-section-title">
        Campus Overview
      </h2>

      <p className="admin-section-subtitle">
        Current academic and performance snapshot
      </p>
    </div>
  </div>


  <div className="admin-overview-grid">

    <div className="admin-stat blue">
      <div className="admin-stat-top">
        <span className="admin-stat-name">
          Total Students
        </span>
        <span className="admin-stat-icon">👥</span>
      </div>

      <div className="admin-stat-value">
        {adminAnalytics?.totalStudents ?? 0}
      </div>

      <div className="admin-stat-note">
        Registered students
      </div>
    </div>


    <div className="admin-stat purple">
      <div className="admin-stat-top">
        <span className="admin-stat-name">
          Total Faculty
        </span>
        <span className="admin-stat-icon">👨‍🏫</span>
      </div>

      <div className="admin-stat-value">
        {adminAnalytics?.totalFaculty ?? 0}
      </div>

      <div className="admin-stat-note">
        Faculty members
      </div>
    </div>


    <div className="admin-stat green">
      <div className="admin-stat-top">
        <span className="admin-stat-name">
          Average CGPA
        </span>
        <span className="admin-stat-icon">✦</span>
      </div>

      <div className="admin-stat-value">
        {Number(adminAnalytics?.averageCGPA ?? 0).toFixed(2)}
      </div>

      <div className="admin-stat-note">
        Academic performance
      </div>
    </div>


    <div className="admin-stat orange">
      <div className="admin-stat-top">
        <span className="admin-stat-name">
          Average Attendance
        </span>
        <span className="admin-stat-icon">◷</span>
      </div>

      <div className="admin-stat-value">
        {Number(adminAnalytics?.averageAttendance ?? 0).toFixed(1)}%
      </div>

      <div className="admin-stat-note">
        Class participation
      </div>
    </div>


    <div className="admin-stat soft-blue">
      <div className="admin-stat-top">
        <span className="admin-stat-name">
          Average DSA
        </span>
        <span className="admin-stat-icon">⌘</span>
      </div>

      <div className="admin-stat-value">
        {Number(adminAnalytics?.averageDSA ?? 0).toFixed(1)}%
      </div>

      <div className="admin-stat-note">
        Problem-solving readiness
      </div>
    </div>


    <div className="admin-stat cyan">
      <div className="admin-stat-top">
        <span className="admin-stat-name">
          Average Aptitude
        </span>
        <span className="admin-stat-icon">%</span>
      </div>

      <div className="admin-stat-value">
        {Number(adminAnalytics?.averageAptitude ?? 0).toFixed(1)}%
      </div>

      <div className="admin-stat-note">
        Assessment performance
      </div>
    </div>

  </div>

</section>
       

        {/* ================= AT RISK ================= */}
        <section className="admin-section admin-risk-section">

          <div className="admin-section-head">
            <div>
              <div className="admin-section-label">
                STUDENT MONITORING
              </div>

              <h2 className="admin-section-title">
                At-Risk Students
              </h2>

              <p className="admin-section-subtitle">
                Students who may require academic attention or mentoring
              </p>
            </div>

            <div className="admin-badge">
              ⚠ ATTENTION REQUIRED
            </div>
          </div>


          <div className="admin-risk-table-wrap">

            {(adminAnalytics?.riskAnalytics?.atRiskDetails || []).length > 0 ? (

              <table className="admin-risk-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Risk Level</th>
                    <th>CGPA</th>
                    <th>Attendance</th>
                    <th>DSA</th>
                    <th>Aptitude</th>
                    <th>Risk Reasons</th>
                  </tr>
                </thead>

                <tbody>
                  {(adminAnalytics?.riskAnalytics?.atRiskDetails || []).map(
                    (student, index) => {

                      const reasons = student.reasons || [];

                      const riskLevel =
                        reasons.length >= 2
                          ? "High Risk"
                          : "Medium Risk";

                      const riskClass =
                        reasons.length >= 2
                          ? "admin-risk-high"
                          : "admin-risk-medium";

                      return (
                        <tr key={student.email || index}>

                          <td>
                            <div className="admin-student">
                              <div className="admin-student-avatar">
                                {(student.name || "S").charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <div className="admin-student-name">
                                  {student.name || "Unknown Student"}
                                </div>

                                <div className="admin-student-email">
                                  {student.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>


                          <td>
                            <span className={riskClass}>
                              {riskLevel}
                            </span>
                          </td>


                          <td>
                            {Number(student.cgpa ?? 0).toFixed(2)}
                          </td>


                          <td>
                            {Number(student.attendance ?? 0).toFixed(0)}%
                          </td>


                          <td>
                            {Number(student.dsaScore ?? 0).toFixed(0)}%
                          </td>


                          <td>
                            {Number(student.aptitudeScore ?? 0).toFixed(0)}%
                          </td>


                          <td>
                            <div className="admin-reason">
                              {reasons.length > 0
                                ? reasons.map((reason, i) => (
                                    <span key={i}>
                                      {reason}
                                    </span>
                                  ))
                                : "No active risk"}
                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

            ) : (

              <div className="admin-empty">
                No students currently require academic attention.
              </div>

            )}

          </div>
        </section>


        {/* ================= BRANCH ANALYTICS ================= */}
        <section className="admin-section">

          <div className="admin-section-head">
            <div>
              <div className="admin-section-label">
                ACADEMIC DISTRIBUTION
              </div>

              <h2 className="admin-section-title">
                Branch Analytics
              </h2>

              <p className="admin-section-subtitle">
                Compare student strength and academic performance across branches
              </p>
            </div>
          </div>


          {(adminAnalytics?.branchWise || []).length > 0 ? (

            <div className="admin-card-grid">

              {adminAnalytics.branchWise.map((item, index) => (
                <div className="admin-mini-card" key={item.branch || index}>

                  <div className="admin-mini-top">
                    <div className="admin-mini-icon">
                      CO
                    </div>

                    <span className="admin-mini-count">
                      {item.count ?? item.students ?? 0} Students
                    </span>
                  </div>

                  <div className="admin-mini-title">
                    {item.branch || "Unknown Branch"}
                  </div>

                  <div className="admin-mini-label">
                    Avg. CGPA
                  </div>

                  <div className="admin-mini-value">
                    {Number(
                      item.averageCGPA ??
                      item.avgCGPA ??
                      0
                    ).toFixed(2)}
                  </div>

                </div>
              ))}

            </div>

          ) : (

            <div className="admin-empty">
              No branch analytics available.
            </div>

          )}

        </section>


        {/* ================= SEMESTER ANALYTICS ================= */}
        <section className="admin-section">

          <div className="admin-section-head">
            <div>
              <div className="admin-section-label">
                ACADEMIC PROGRESSION
              </div>

              <h2 className="admin-section-title">
                Semester Analytics
              </h2>

              <p className="admin-section-subtitle">
                Semester-wise student distribution and academic performance
              </p>
            </div>
          </div>


          {(adminAnalytics?.semesterWise || []).length > 0 ? (

            <div className="admin-card-grid">

              {adminAnalytics.semesterWise.map((item, index) => (
                <div
                  className="admin-mini-card semester"
                  key={item.semester || index}
                >

                  <div className="admin-mini-top">
                    <div className="admin-mini-icon">
                      ◷
                    </div>

                       <span className="admin-mini-count">
                         Semester
                      </span>
                  </div>

                  <div className="admin-mini-title">
                    {item.semester || `Semester ${index + 1}`}
                  </div>

                  <div className="admin-mini-label">
                    Enrolled students
                  </div>

                  <div className="admin-mini-value">
                    {item.count ?? item.students ?? 0}
                  </div>

                </div>
              ))}

            </div>

          ) : (

            <div className="admin-empty">
              No semester analytics available.
            </div>

          )}

        </section>


        

        {/* =================================================
            PROFILE
            ================================================= */}
{/* ================= RISK ANALYTICS — LAST ================= */}

        <section className="admin-section admin-final-risk">

          <div className="admin-section-head">
            <div>
              <div className="admin-section-label">
                STUDENT SAFETY & SUPPORT
              </div>

              <h2 className="admin-section-title">
                Risk Analytics
              </h2>

              <p className="admin-section-subtitle">
                Campus-level academic risk overview and recommended action
              </p>
            </div>

            <div className="admin-badge">
              ⚠ RISK MONITORING
            </div>
          </div>

          <div className="admin-risk-snapshot">
             <span>RISK SNAPSHOT</span>
      </div>


          {/* SUMMARY */}
          <div className="admin-risk-summary">

            <div className="admin-summary-card">
              <div className="admin-summary-label">
                Total Students
              </div>

              <div className="admin-summary-value">
                {adminAnalytics?.riskAnalytics?.totalStudents ?? 0}
              </div>
            </div>


            <div className="admin-summary-card danger">
              <div className="admin-summary-label">
                At-Risk
              </div>

              <div className="admin-summary-value">
                {adminAnalytics?.riskAnalytics?.atRiskStudents ?? 0}
              </div>
            </div>


            <div className="admin-summary-card safe">
              <div className="admin-summary-label">
                Safe
              </div>

              <div className="admin-summary-value">
                {adminAnalytics?.riskAnalytics?.safeStudents ?? 0}
              </div>
            </div>

          </div>

            {/* RISK LEVELS */}
<div className="admin-risk-levels">

  <div className="admin-level high">
    <div className="admin-level-title">
      🔴 High Risk
    </div>

    <div className="admin-level-value">
      {
        (
          adminAnalytics?.riskAnalytics?.atRiskDetails || []
        ).filter(
          student => student.riskLevel === "High"
        ).length
      }
    </div>

    <small>
      High-risk students
    </small>
  </div>


  <div className="admin-level medium">
    <div className="admin-level-title">
      🟠 Medium Risk
    </div>

    <div className="admin-level-value">
      {
        (
          adminAnalytics?.riskAnalytics?.atRiskDetails || []
        ).filter(
          student => student.riskLevel === "Medium"
        ).length
      }
    </div>

    <small>
      Medium-risk students
    </small>
  </div>


  <div className="admin-level low">
    <div className="admin-level-title">
      🟢 Low Risk
    </div>

    <div className="admin-level-value">
      {
        (
          adminAnalytics?.riskAnalytics?.atRiskDetails || []
        ).filter(
          student => student.riskLevel === "Low"
        ).length
        + (adminAnalytics?.riskAnalytics?.safeStudents ?? 0)
      }
    </div>

    <small>
      Low or no active risk
    </small>
  </div>

</div>


          {/* RISK PERCENTAGE + THRESHOLD */}
          <div className="admin-risk-bottom">

            <div className="admin-risk-box">

              <div className="admin-risk-box-title">
                Risk Percentage
              </div>

              <div className="admin-risk-percent">
                {Number(
                  adminAnalytics?.riskAnalytics?.riskPercentage ?? 0
                ).toFixed(1)}%
              </div>

              <div className="admin-risk-bar">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        Number(
                          adminAnalytics?.riskAnalytics?.riskPercentage ?? 0
                        )
                      )
                    )}%`
                  }}
                />
              </div>

              <p>
                Percentage of students currently identified as at-risk
              </p>

            </div>


            <div className="admin-risk-box">

              <div className="admin-risk-box-title">
                RISK THRESHOLD
              </div>

              <div className="admin-threshold-row">
                <span>CGPA</span>
                <strong>Below 6.5</strong>
              </div>

              <div className="admin-threshold-row">
                <span>Attendance</span>
                <strong>Below 70%</strong>
              </div>

            </div>

          </div>


          {/* RECOMMENDATION */}
         
         <div className="admin-recommendation">

  <div className="admin-recommendation-title">
    💡
  </div>

  <div>
    <div className="admin-recommendation-label">
      RECOMMENDATION
    </div>

    <h4>
      Prioritize mentoring for students showing repeated risk indicators.
    </h4>

    <p>
      Use attendance, CGPA, DSA and aptitude trends together to identify
      students who may benefit from targeted academic support and
      career-readiness guidance.
    </p>
  </div>

</div>

{/* AT-RISK STUDENT DETAILS */}

<div className="admin-at-risk-details">

  <div className="admin-section-label">
    WHY AT RISK?
  </div>

  <h3 className="admin-risk-details-title">
    Students Requiring Attention
  </h3>

  <p className="admin-risk-details-subtitle">
    Students currently showing one or more academic or placement risk indicators.
  </p>

  {(adminAnalytics?.riskAnalytics?.atRiskDetails || []).length === 0 ? (

    <div className="admin-empty-risk">
      ✅ No students are currently identified as at-risk.
    </div>

  ) : (

    <div className="admin-risk-student-list">

      {adminAnalytics.riskAnalytics.atRiskDetails.map((student) => (

        <div
          className="admin-risk-student-card"
          key={student.studentId}
        >

          <div className="admin-risk-student-header">

            <div>
              <h4>{student.name}</h4>
              <span>{student.email}</span>
            </div>

            <div className="admin-risk-count">
              {student.reasons?.length || 0} Risk Indicator
              {student.reasons?.length === 1 ? "" : "s"}
            </div>
              <div
  className={`admin-risk-level ${
    student.riskLevel === "High Risk"
      ? "high"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      : student.riskLevel === "Medium Risk"
        ? "medium"
        : "low"
  }`}
>
  {student.riskLevel === "High Risk" && "🔴 High Risk"}
  {student.riskLevel === "Medium Risk" && "🟠 Medium Risk"}
  {student.riskLevel === "Low Risk" && "🟢 Low Risk"}
</div>


          </div>


          <div className="admin-risk-metrics">

            <div>
              <span>CGPA</span>
              <strong>{student.cgpa}</strong>
            </div>

            <div>
              <span>Attendance</span>
              <strong>{student.attendance}%</strong>
            </div>

            <div>
              <span>DSA</span>
              <strong>{student.dsaScore}</strong>
            </div>

            <div>
              <span>Aptitude</span>
              <strong>{student.aptitudeScore}</strong>
            </div>

          </div>


        <div className="admin-risk-reasons">

  <div className="admin-risk-reasons-label">
    Risk Analysis
  </div>

  <div className="admin-risk-reason-list">

    {(student.reasons || []).map((reason, index) => (

      <div
        className="admin-risk-reason"
        key={index}
      >
        <span>⚠️</span>
        <span>{reason}</span>
      </div>

    ))}

  </div>

  {student.recommendations?.length > 0 && (
    <div className="admin-risk-recommendations">

      <div className="admin-risk-recommendations-label">
        Recommended Actions
      </div>

      <div className="admin-risk-recommendation-list">

        {student.recommendations.map(
          (recommendation, index) => (

            <div
              className="admin-risk-recommendation"
              key={index}
            >
              <span>✓</span>
              <span>{recommendation}</span>
            </div>

          )
        )}

      </div>

    </div>
  )}

</div>

        </div>

      ))}

    </div>

  )}

</div>

{adminAnalytics.riskAnalytics?.riskReasonSummary && (
  <div className="stats-grid" style={{ marginTop: "20px" }}>

    <div className="stat-card">
      <span>Low CGPA</span>
      <strong>
        {adminAnalytics.riskAnalytics.riskReasonSummary.lowCGPA ?? 0}
      </strong>
    </div>

    <div className="stat-card">
      <span>Low Attendance</span>
      <strong>
        {adminAnalytics.riskAnalytics.riskReasonSummary.lowAttendance ?? 0}
      </strong>
    </div>

    <div className="stat-card">
      <span>Low DSA</span>
      <strong>
        {adminAnalytics.riskAnalytics.riskReasonSummary.lowDSA ?? 0}
      </strong>
    </div>

    <div className="stat-card">
      <span>Low Aptitude</span>
      <strong>
        {adminAnalytics.riskAnalytics.riskReasonSummary.lowAptitude ?? 0}
      </strong>
    </div>

  </div>
)}


        </section>

      </>
    )}

  </div>
)}

        {/* ===================================================== */}
        {/* PROFILE */}
        {/* ===================================================== */}


        {view === "My Profile" && (
          <section className="panel wide-panel">

            <div className="panel-title">

              <div>

                <h3>
                  Student profile
                </h3>

                <p className="muted">
                  Keep your academic and
                  skill information current.
                </p>

              </div>

            </div>

            <form
              onSubmit={saveProfile}
            >

              <div className="profile-grid">

                <Field
                  label="Branch"
                  value={
                    profile.branch
                  }
                  onChange={v =>
                    update(
                      "branch",
                      v
                    )
                  }
                />

                <Field
                  label="Semester"
                  type="number"
                  value={
                    profile.semester
                  }
                  onChange={v =>
                    update(
                      "semester",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="CGPA (0–10)"
                  type="number"
                  value={
                    profile.cgpa
                  }
                  onChange={v =>
                    update(
                      "cgpa",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="Attendance (%)"
                  type="number"
                  value={
                    profile.attendance
                  }
                  onChange={v =>
                    update(
                      "attendance",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="Target role"
                  value={
                    profile.targetRole
                  }
                  onChange={v =>
                    update(
                      "targetRole",
                      v
                    )
                  }
                />

                <Field
                  label="Projects completed"
                  type="number"
                  value={
                    profile.projects
                  }
                  onChange={v =>
                    update(
                      "projects",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="Internships completed"
                  type="number"
                  value={
                    profile.internships
                  }
                  onChange={v =>
                    update(
                      "internships",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="DSA practice score (%)"
                  type="number"
                  value={
                    profile.dsaScore
                  }
                  onChange={v =>
                    update(
                      "dsaScore",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="Aptitude score (%)"
                  type="number"
                  value={
                    profile.aptitudeScore
                  }
                  onChange={v =>
                    update(
                      "aptitudeScore",
                      Number(v)
                    )
                  }
                />

                <Field
                  label="Communication score (%)"
                  type="number"
                  value={
                    profile.communicationScore
                  }
                  onChange={v =>
                    update(
                      "communicationScore",
                      Number(v)
                    )
                  }
                />

              </div>

              <label className="field full-field">

                Skills (comma-separated)

                <input
                  value={
                    Array.isArray(
                      profile.skills
                    )
                      ? profile.skills.join(
                          ", "
                        )
                      : profile.skills
                  }
                  onChange={e =>
                    update(
                      "skills",
                      e.target.value
                    )
                  }
                  placeholder="Java, React, SQL, Data Structures"
                />

              </label>

              <label className="field full-field">

                Certifications
                (comma-separated)

                <input
                  value={
                    Array.isArray(
                      profile.certifications
                    )
                      ? profile.certifications.join(
                          ", "
                        )
                      : profile.certifications
                  }
                  onChange={e =>
                    update(
                      "certifications",
                      e.target.value
                    )
                  }
                  placeholder="Python, Cloud, AI/ML"
                />

              </label>

              <button
                className="primary"
                disabled={busy}
              >
                {busy
                  ? "Saving…"
                  : "Save profile"}
              </button>

            </form>

          </section>
        )}

{/* =================================================
    CAREER MATCHES
    ================================================= */}

{view === "Career Matches" && (
  <div>

    <section className="panel">

      <p className="eyebrow">
        CAREER INTELLIGENCE
      </p>

      <h2>
        Personalized Career Recommendations
      </h2>

      <p className="muted">
        Recommendations are based on your current
        skills and target role.
      </p>

    </section>


    {careers.length === 0 ? (

      <section className="panel">

        <h3>
          No recommendations available
        </h3>

        <p className="muted">
          Add your skills and target role in My Profile
          to generate career recommendations.
        </p>

        <button
          className="primary"
          onClick={() => setView("My Profile")}
        >
          Update My Profile
        </button>

      </section>

    ) : (

      <div className="two-col">

        {careers.map((career) => (

          <section
            className="panel"
            key={career.role}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px"
              }}
            >

              <div>

                <p className="eyebrow">
                  CAREER MATCH
                </p>

                <h2>
                  {career.role}
                </h2>

              </div>


              <div className="stat-card">

                <span>
                  Match Score
                </span>

                <strong>
                  {career.score}%
                </strong>

              </div>

            </div>


            <p className="muted">
              {career.description}
            </p>


            <hr />


            <h3>
              Matched Skills
            </h3>


            {career.matchedSkills?.length > 0 ? (

              <div className="skills-list">

                {career.matchedSkills.map((skill) => (

                  <span
                    className="skill-tag"
                    key={skill}
                  >
                    ✓ {skill}
                  </span>

                ))}

              </div>

            ) : (

              <p className="muted">
                No matching skills yet.
              </p>

            )}


            <h3
              style={{
                marginTop: "20px"
              }}
            >
              Skills to Improve
            </h3>


            {career.missingSkills?.length > 0 ? (

              <div
                style={{
                  marginTop: "8px"
                }}
              >

                {career.missingSkills.map((skill) => (

                  <div
                    key={skill}
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      background: "#f8fafc"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >

                      <span>
                        + {skill}
                      </span>


                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",

                          background:
                            getSkillPriority(skill) ===
                            "High Priority"
                              ? "#fee2e2"
                              : getSkillPriority(skill) ===
                                "Medium Priority"
                              ? "#fef3c7"
                              : "#dcfce7",

                          color:
                            getSkillPriority(skill) ===
                            "High Priority"
                              ? "#b91c1c"
                              : getSkillPriority(skill) ===
                                "Medium Priority"
                              ? "#92400e"
                              : "#166534"
                        }}
                      >
                        {getSkillPriority(skill)}
                      </span>

                    </div>


                    <small
                      style={{
                        display: "block",
                        marginTop: "5px",
                        opacity: 0.7
                      }}
                    >
                      {getSkillPriorityReason(skill)}
                    </small>


                    <div
                      style={{
                        marginTop: "12px"
                      }}
                    >

                      <strong>
                        Recommended Learning
                      </strong>


                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          marginTop: "8px"
                        }}
                      >

                        {getSkillLearningPlan(skill).map(
                          (item, index) => (

                            <div
                              key={item}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 9px",
                                borderRadius: "8px",
                                background:
                                  "rgba(0, 0, 0, 0.04)"
                              }}
                            >

                              <span
                                style={{
                                  minWidth: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  background:
                                    "rgba(0, 0, 0, 0.08)"
                                }}
                              >
                                {index + 1}
                              </span>


                              <span
                                style={{
                                  fontSize: "13px"
                                }}
                              >
                                {item}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>


                    <button
                      type="button"
                      className="primary"
                      style={{
                        marginTop: "12px"
                      }}
                      onClick={async () => {

                        setActiveLearningSkill(
                          skill
                        );

                        setMessage(
                          `Learning plan opened for ${skill}.`
                        );

                        await loadLearningProgress(
                          skill
                        );

                      }}
                    >
                      Start Learning
                    </button>


                    {activeLearningSkill === skill && (

                      <div
                        style={{
                          marginTop: "16px",
                          padding: "14px",
                          borderRadius: "12px",
                          background:
                            "rgba(0, 0, 0, 0.04)"
                        }}
                      >

                        <strong>
                          Learning Plan — {skill}
                        </strong>


                        <p
                          className="muted"
                          style={{
                            marginTop: "6px"
                          }}
                        >
                          Complete the steps in order
                          to improve this skill.
                        </p>


                        {(() => {

                          const plan =
                            getSkillLearningPlan(
                              skill
                            );

                          const completed =
                            plan.filter(
                              (_, index) =>
                                completedLearningItems[
                                  `${skill}-${index}`
                                ]
                            ).length;

                          const progress =
                            plan.length > 0
                              ? Math.round(
                                  (completed /
                                    plan.length) *
                                    100
                                )
                              : 0;


                          return (

                            <>

                              <div
                                style={{
                                  marginTop: "12px"
                                }}
                              >

                                <strong>
                                  Progress: {progress}%
                                </strong>


                                <div
                                  style={{
                                    height: "8px",
                                    borderRadius: "10px",
                                    background:
                                      "rgba(0, 0, 0, 0.1)",
                                    overflow: "hidden",
                                    marginTop: "6px"
                                  }}
                                >

                                  <div
                                    style={{
                                      width: `${progress}%`,
                                      height: "100%",
                                      background: "#111",
                                      transition:
                                        "width 0.3s ease"
                                    }}
                                  />

                                </div>

                              </div>


                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                  marginTop: "14px"
                                }}
                              >

                                {plan.map(
                                  (item, index) => {

                                    const completed =
                                      completedLearningItems[
                                        `${skill}-${index}`
                                      ];


                                    return (

                                      <label
                                        key={item}
                                        style={{
                                          display: "flex",
                                          alignItems:
                                            "center",
                                          gap: "10px",
                                          padding: "9px",
                                          borderRadius:
                                            "8px",
                                          background:
                                            "white",
                                          cursor:
                                            "pointer"
                                        }}
                                      >

                                        <input
                                          type="checkbox"
                                          checked={
                                            !!completed
                                          }
                                          onChange={() =>
                                            toggleLearningItem(
                                              skill,
                                              index
                                            )
                                          }
                                        />


                                        <span
                                          style={{
                                            textDecoration:
                                              completed
                                                ? "line-through"
                                                : "none",

                                            opacity:
                                              completed
                                                ? 0.6
                                                : 1
                                          }}
                                        >
                                          {index + 1}.{" "}
                                          {item}
                                        </span>

                                      </label>

                                    );

                                  }
                                )}

                              </div>


                              {progress === 100 && (

                                <p
                                  style={{
                                    marginTop: "12px",
                                    fontWeight: "700"
                                  }}
                                >
                                  🎉 Learning plan completed!
                                </p>

                              )}

                            </>

                          );

                        })()}

                      </div>

                    )}

                  </div>

                ))}

              </div>

            ) : (

              <p className="muted">
                No major skill gaps.
              </p>

            )}

          </section>

        ))}

      </div>

    )}

  </div>
)}

      

        {/* =================================================
            READINESS
            ================================================= */}

        {view === "Readiness" && (
          <div className="two-col readiness-layout">

            <section className="panel readiness-panel">

              <p className="eyebrow">
                PLACEMENT PREPARATION
              </p>

              <div
                className="score-circle"
                style={{
                  "--score": `${
                    readiness?.score || 0
                  }%`
                }}
              >

                <div>

                  <strong>
                    {readiness?.score ||
                      0}
                  </strong>

                  <small>
                    out of 100
                  </small>

                </div>

              </div>

              <h3>
                {readiness?.band ||
                  "Add your profile details"}
              </h3>

              <p className="muted">
                {readiness?.note}
              </p>

              <button
                className="primary"
                onClick={() =>
                  setView(
                    "My Profile"
                  )
                }
              >
                Improve my profile
              </button>

              <button
                className="primary"
                style={{
                  marginTop: "10px"
                }}
                onClick={
                  runMLPrediction
                }
                disabled={
                  mlLoading
                }
              >
                {mlLoading
                  ? "Running ML model..."
                  : "Run AI/ML Demo Prediction"}
              </button>

              {mlPrediction && (
                <div
                  className="notice"
                  style={{
                    marginTop: "16px"
                  }}
                >

                  <h3>
                    ML Model Output
                  </h3>

                  <p>
                    Demo prediction score:{" "}
                    <strong>
                      {
                        mlPrediction.demoPrediction
                      }
                      /100
                    </strong>
                  </p>

                  <p>
                    Model:{" "}
                    {mlPrediction.model}
                  </p>

                  <p>
                    {mlPrediction.warning}
                  </p>

                </div>
              )}

            </section>

            <section className="panel">

              <h3>
                Readiness factors
              </h3>

              {Object.entries(
                readiness?.factors || {}
              ).map(([k, v]) => (

                <div
                  className="factor-row"
                  key={k}
                >

                  <div>

                    <span>
                      {k.replace(
                        /([A-Z])/g,
                        " $1"
                      )}
                    </span>

                    <b>
                      {v}%
                    </b>

                  </div>

                  <div className="progress">

                    <span
                      style={{
                        width: `${v}%`
                      }}
                    ></span>

                  </div>

                </div>

              ))}

            </section>

          </div>
        )}

        {/* =================================================
            ROADMAP
            ================================================= */}

        {view === "Learning Roadmap" && (
          <section className="panel wide-panel">

            <div className="panel-title">

              <div>

                <h3>
                  Your learning roadmap
                </h3>

                <p className="muted">
                  A starter plan you can adjust
                  with your project guide or mentor.
                </p>

              </div>

            </div>

            <div className="roadmap">

              {roadmap.map(r => (
                <div
                  className="roadmap-item"
                  key={r.week}
                >

                  <div className="roadmap-marker">
                    {r.week}
                  </div>

                  <div>

                    <span className="tiny">
                      WEEK {r.week} ·{" "}
                      {r.status.toUpperCase()}
                    </span>

                    <h3>
                      {r.title}
                    </h3>

                    <p>
                      {r.action}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        <footer>
          CampusAI · Academic and career
          planning workspace{" "}
          <span>
            Prototype for educational use

      </span>
              </footer>

      </main>
    </div>
  );

}

function Metric({
  title,
  value,
  icon,
  hint
}) {
  return (
    <div className="metric-card">

      <div className="metric-top">

        <span>
          {title}
        </span>

        <span className="metric-icon">
          {icon}
        </span>

      </div>

      <strong>
        {value}
      </strong>

      <small>
        {hint}
      </small>

    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}) {
  return (
    <label className="field">

      {label}

      <input
        type={type}
        min={
          type === "number"
            ? 0
            : undefined
        }
        max={
          type === "number" &&
          ["CGPA (0–10)"].includes(

            label
          )
            ? 10
            : undefined
        }
        value={value ?? ""}
        onChange={e =>
          onChange(
            e.target.value
          )
        }
      />

    </label>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);