import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-ai-henna-ten.vercel.app"
  ]
}));

app.use(express.json());

const profileSchema = new mongoose.Schema({
  branch: {
    type: String,
    default: "Computer Science and Engineering"
  },
  semester: {
    type: Number,
    default: 7
  },
  cgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  targetRole: {
    type: String,
    default: "Software Developer"
  },
  skills: {
    type: [String],
    default: []
  },
  certifications: {
    type: [String],
    default: []
  },
  projects: {
    type: Number,
    default: 0,
    min: 0
  },
  internships: {
    type: Number,
    default: 0,
    min: 0
  },
  dsaScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  aptitudeScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  communicationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  _id: false
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    default: "student"
  },
  profile: {
    type: profileSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

const academicRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    credits: {
      type: Number,
      default: 3,
      min: 1,
      max: 10
    },

    grade: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const AcademicRecord = mongoose.model(
  "AcademicRecord",
  academicRecordSchema
);

const learningProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    skill: {
      type: String,
      required: true,
      trim: true
    },

    completedItems: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const LearningProgress = mongoose.model(
  "LearningProgress",
  learningProgressSchema
);


const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  profile: u.profile,
  createdAt: u.createdAt
});

const makeToken = (u) => jwt.sign(
  {
    id: String(u._id),
    role: u.role
  },
  process.env.JWT_SECRET || "development_only_change_me",
  {
    expiresIn: "7d"
  }
);

async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      message: "Authentication token required."
    });
  }

  try {
    req.auth = jwt.verify(
      token,
      process.env.JWT_SECRET || "development_only_change_me"
    );

    req.user = await User.findById(req.auth.id);

    if (!req.user) {
      return res.status(401).json({
        message: "Account not found."
      });
    }

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "You do not have permission for this resource."
    });
  }

  next();
};

function readiness(p = {}) {
  const cgpa =
    Math.max(0, Math.min(10, Number(p.cgpa) || 0)) * 10;

  const attendance =
    Math.max(0, Math.min(100, Number(p.attendance) || 0));

  const dsa =
    Math.max(0, Math.min(100, Number(p.dsaScore) || 0));

  const aptitude =
    Math.max(0, Math.min(100, Number(p.aptitudeScore) || 0));

  const communication =
    Math.max(0, Math.min(100, Number(p.communicationScore) || 0));

  const skills =
    Math.min(100, (p.skills?.length || 0) * 12);

  const projects =
    Math.min(100, (Number(p.projects) || 0) * 25);

  const internships =
    Math.min(100, (Number(p.internships) || 0) * 35);

  const score = Math.round(
    cgpa * .18 +
    attendance * .10 +
    dsa * .22 +
    aptitude * .18 +
    communication * .10 +
    skills * .10 +
    projects * .07 +
    internships * .05
  );

  return {
    score,
    band:
      score >= 75
        ? "Strong preparation"
        : score >= 50
          ? "Developing"
          : "Needs focused practice",

    factors: {
      cgpa: Math.round(cgpa),
      attendance,
      dsa,
      aptitude,
      communication,
      skills,
      projects,
      internships
    },

    note:
      "This is a transparent project heuristic, not a validated prediction of hiring outcomes."
  };
}

const careerCatalog = [
  {
    role: "Full Stack Developer",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "REST APIs"
    ]
  },
  {
    role: "Software Developer",
    skills: [
      "Java",
      "Data Structures",
      "Algorithms",
      "OOP",
      "SQL",
      "Git"
    ]
  },
  {
    role: "Data Analyst",
    skills: [
      "Python",
      "SQL",
      "Excel",
      "Pandas",
      "Data Visualization",
      "Statistics"
    ]
  },
  {
    role: "Machine Learning Engineer",
    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Statistics",
      "Model Evaluation"
    ]
  },
  {
    role: "QA / Test Engineer",
    skills: [
      "Testing",
      "Test Cases",
      "Java",
      "SQL",
      "API Testing",
      "Automation"
    ]
  }
];

function careerMatches(profile = {}) {
  const have = new Set(
    (profile.skills || []).map(
      s => s.toLowerCase().trim()
    )
  );

  return careerCatalog
    .map(c => {
      const matched = c.skills.filter(
        s => have.has(s.toLowerCase())
      );

      const missing = c.skills.filter(
        s => !have.has(s.toLowerCase())
      );

      return {
        role: c.role,
        matchPercent: Math.round(
          matched.length / c.skills.length * 100
        ),
        matchedSkills: matched,
        missingSkills: missing
      };
    })
    .sort(
      (a, b) => b.matchPercent - a.matchPercent
    );
}

function roadmap(profile = {}) {
  const have = new Set(
    (profile.skills || []).map(
      s => s.toLowerCase().trim()
    )
  );

  const tasks = [
    [
      "Data Structures",
      "Practice arrays, strings, hashing, linked lists, trees and graphs",
      "Data Structures"
    ],
    [
      "Problem Solving",
      "Solve 3–5 timed coding problems each week",
      "Algorithms"
    ],
    [
      "Web Development",
      "Build and deploy one full-stack feature with API validation",
      "REST APIs"
    ],
    [
      "Database",
      "Practice SQL queries, indexes and data modelling",
      "SQL"
    ],
    [
      "Projects",
      "Document project architecture, screenshots, testing and limitations",
      "Git"
    ]
  ];

  return tasks.map(
    ([title, action, skill], i) => ({
      week: i + 1,
      title,
      action,
      status: have.has(skill.toLowerCase())
        ? "Review and strengthen"
        : "Recommended"
    })
  );
}

app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "CampusAI API"
  })
);

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body || {};

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Name, email and password (at least 8 characters) are required."
      });
    }

    if (
      await User.findOne({
        email: email.toLowerCase().trim()
      })
    ) {
      return res.status(409).json({
        message:
          "An account with this email already exists."
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash
    });

    res.status(201).json({
      token: makeToken(user),
      user: safeUser(user)
    });
  } catch (e) {
    res.status(500).json({
      message: "Could not register account.",
      detail: e.message
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body || {};

    const user = await User.findOne({
      email: String(email || "")
        .toLowerCase()
        .trim()
    });

    if (
      !user ||
      !(await bcrypt.compare(
        password || "",
        user.passwordHash
      ))
    ) {
      return res.status(401).json({
        message: "Incorrect email or password."
      });
    }

    res.json({
      token: makeToken(user),
      user: safeUser(user)
    });
  } catch (e) {
    res.status(500).json({
      message: "Could not log in.",
      detail: e.message
    });
  }
});

app.get(
  "/api/profile",
  auth,
  (req, res) =>
    res.json({
      user: safeUser(req.user)
    })
);

app.put("/api/profile", auth, async (req, res) => {
  try {

    console.log("PROFILE UPDATE BODY:", req.body);
    const allowed = [
      "branch",
      "semester",
      "cgpa",
      "attendance",
      "targetRole",
      "skills",
      "certifications",
      "projects",
      "internships",
      "dsaScore",
      "aptitudeScore",
      "communicationScore"
    ];

      for (const key of allowed) {
  if (key in (req.body || {})) {
    req.user.set(`profile.${key}`, req.body[key]);
  }
}

await req.user.save();
console.log("PROFILE AFTER SAVE:", req.user.profile);
const freshUser = await User.findById(req.user._id)
  .select("name email role profile");

console.log("PROFILE FRESH FROM DB:", {
  id: freshUser._id.toString(),
  name: freshUser.name,
  email: freshUser.email,
  role: freshUser.role,
  profile: freshUser.profile
});


    res.json({
      user: safeUser(req.user)
    });
  } catch (e) {
    res.status(400).json({
      message: "Could not update profile.",
      detail: e.message
    });
  }
});

/* =========================================================
   ACADEMIC APIs
   ========================================================= */

/* GET academic records */
app.get("/api/academic", auth, async (req, res) => {
  try {
    const records =
      await AcademicRecord.find({
        userId: req.user._id
      }).sort({
        semester: 1,
        subject: 1
      });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch academic records"
    });
  }
});

/* POST academic record */
app.post("/api/academic", auth, async (req, res) => {
  try {
    const {
      semester,
      subject,
      marks,
      attendance,
      credits,
      grade
    } = req.body;

    if (
      semester === undefined ||
      !subject ||
      marks === undefined ||
      attendance === undefined
    ) {
      return res.status(400).json({
        message:
          "Semester, subject, marks and attendance are required"
      });
    }

    const record =
      await AcademicRecord.create({
        userId: req.user._id,
        semester,
        subject,
        marks,
        attendance,
        credits,
        grade
      });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create academic record"
    });
  }
});

/* DELETE academic record */
app.delete(
  "/api/academic/:id",
  auth,
  async (req, res) => {
    try {
      const record =
        await AcademicRecord.findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id
        });

      if (!record) {
        return res.status(404).json({
          message: "Academic record not found"
        });
      }

      res.json({
        message:
          "Academic record deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to delete academic record"
      });
    }
  }
);

app.get("/api/learning-progress/:skill", auth, async (req, res) => {
  try {
    const progress = await LearningProgress.findOne({
      userId: req.user._id,
      skill: req.params.skill
    });

    res.json(
      progress || {
        skill: req.params.skill,
        completedItems: []
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Failed to load learning progress"
    });
  }
});
app.put("/api/learning-progress/:skill", auth, async (req, res) => {
  try {
    const { completedItems } = req.body;

    if (!Array.isArray(completedItems)) {
      return res.status(400).json({
        message: "completedItems must be an array"
      });
    }

    const progress = await LearningProgress.findOneAndUpdate(
      {
        userId: req.user._id,
        skill: req.params.skill
      },
      {
        userId: req.user._id,
        skill: req.params.skill,
        completedItems
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save learning progress"
    });
  }
});



/* =========================================================
   ANALYTICS
   ========================================================= */

app.get(
  "/api/analytics/readiness",
  auth,
  (req, res) =>
    res.json(
      readiness(req.user.profile)
    )
);

app.post(
  "/api/analytics/ml-prediction",
  auth,
  async (req, res) => {
    try {
      const p = req.user.profile;

      const response = await fetch(
        `${process.env.ML_SERVICE_URL || "http://127.0.0.1:8000"}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cgpa: p.cgpa,
            attendance: p.attendance,
            dsaScore: p.dsaScore,
            aptitudeScore: p.aptitudeScore,
            communicationScore:
              p.communicationScore,
            projects: p.projects,
            internships: p.internships
          })
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        return res
          .status(response.status)
          .json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(503).json({
        message:
          "ML service is unavailable. Please check whether Python service is running."
      });
    }
  }
);

app.get("/api/analytics/careers", auth, async (req, res) => {
  try {
    const profile = req.user.profile || {};

    const userSkills = (profile.skills || [])
      .map((skill) => skill.toLowerCase().trim());

    const targetRole = (profile.targetRole || "")
      .toLowerCase()
      .trim();

    const careerPaths = [
      {
        role: "Full Stack Developer",
        keywords: [
          "javascript",
          "react",
          "node.js",
          "node",
          "express",
          "mongodb",
          "html",
          "css",
          "rest api"
        ],
        description:
          "Build complete web applications using frontend, backend and database technologies."
      },
      {
        role: "Frontend Developer",
        keywords: [
          "javascript",
          "react",
          "html",
          "css",
          "frontend"
        ],
        description:
          "Develop responsive and interactive user interfaces for web applications."
      },
      {
        role: "Backend Developer",
        keywords: [
          "node.js",
          "node",
          "express",
          "mongodb",
          "mysql",
          "rest api",
          "backend"
        ],
        description:
          "Design APIs, server-side applications and database-driven systems."
      },
      {
        role: "Java Developer",
        keywords: [
          "java",
          "spring",
          "spring boot",
          "mysql",
          "rest api",
          "dsa"
        ],
        description:
          "Develop scalable backend and enterprise applications using Java."
      },
      {
        role: "AI/ML Developer",
        keywords: [
          "python",
          "machine learning",
          "ai",
          "scikit-learn",
          "pandas",
          "numpy"
        ],
        description:
          "Build data-driven applications and machine learning solutions."
      }
    ];

    const recommendations = careerPaths.map((career) => {
      const matchedSkills = career.keywords.filter((keyword) =>
        userSkills.some(
          (skill) =>
            skill === keyword ||
            skill.includes(keyword) ||
            keyword.includes(skill)
        )
      );

      const missingSkills = career.keywords.filter(
        (keyword) =>
          !matchedSkills.includes(keyword)
      );

      const skillScore =
        (matchedSkills.length / career.keywords.length) * 100;

      const roleBonus =
        targetRole &&
        career.role.toLowerCase().includes(targetRole)
          ? 20
          : 0;

      const score = Math.min(
        100,
        Math.round(skillScore + roleBonus)
      );

      return {
        role: career.role,
        score,
        description: career.description,
        matchedSkills,
        missingSkills
      };
    });

    recommendations.sort(
      (a, b) => b.score - a.score
    );

    res.json(recommendations.slice(0, 3));
  } catch (error) {
    console.error(
      "Career recommendation error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate career recommendations"
    });
  }
});

app.get(
  "/api/analytics/roadmap",
  auth,
  (req, res) =>
    res.json({
      roadmap:
        roadmap(req.user.profile)
    })
);

/* =========================================================
   FACULTY / ADMIN
   ========================================================= */

app.get(
  "/api/faculty/students",
  auth,
  allowRoles("faculty", "admin"),
  async (_req, res) => {
    try {
      const students = await User.find({
        role: "student"
      })
        .select("name email role profile createdAt")
        .sort({
          name: 1
        })
        .limit(200);

      res.json(
        students.map(safeUser)
      );
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch students"
      });
    }
  }
);

app.get(
  "/api/faculty/academic/:studentId",
  auth,
  allowRoles("faculty", "admin"),
  async (req, res) => {
    try {
      const student = await User.findOne({
        _id: req.params.studentId,
        role: "student"
      }).select("_id");

      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      const records = await AcademicRecord.find({
        userId: req.params.studentId
      }).sort({
        semester: 1,
        subject: 1
      });

      res.json(records);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch academic records"
      });
    }
  }
);

app.get(
  "/api/faculty/at-risk",
  auth,
  allowRoles("faculty", "admin"),
  async (_req, res) => {
    try {
      const students = await User.find({
        role: "student"
      })
        .select("name email profile createdAt")
        .sort({
          name: 1
        });

      const atRisk = students.filter(student => {
        const profile = student.profile || {};

        const lowCGPA =
          Number(profile.cgpa || 0) < 6.5;

        const lowAttendance =
          Number(profile.attendance || 0) < 70;

        const lowDSA =
          Number(profile.dsaScore || 0) < 40;

        const lowAptitude =
          Number(profile.aptitudeScore || 0) < 40;

        return (
          lowCGPA ||
          lowAttendance ||
          lowDSA ||
          lowAptitude
        );
      });

      res.json(
        atRisk.map(safeUser)
      );
    } catch (error) {
      res.status(500).json({
        message: "Failed to calculate at-risk students"
      });
    }
  }
);

app.get("/api/admin/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const totalStudents = await User.countDocuments({
      role: "student"
    });

    const totalFaculty = await User.countDocuments({
      role: "faculty"
    });

    const students = await User.find({
      role: "student"
    }).select("-passwordHash");

     console.log(
  "ADMIN ANALYTICS PROFILES:",
  students.map(s => ({
    id: s._id.toString(),
    name: s.name,
    email: s.email,
    role: s.role,
    cgpa: s.profile?.cgpa,
    attendance: s.profile?.attendance,
    dsaScore: s.profile?.dsaScore,
    aptitudeScore: s.profile?.aptitudeScore
  }))
);

    const avgCGPA =
      students.length > 0
        ? students.reduce(
            (sum, student) =>
              sum + Number(student.profile?.cgpa || 0),
            0
          ) / students.length
        : 0;

    const avgAttendance =
      students.length > 0
        ? students.reduce(
            (sum, student) =>
              sum + Number(student.profile?.attendance || 0),
            0
          ) / students.length
        : 0;

    const avgDSA =
      students.length > 0
        ? students.reduce(
            (sum, student) =>
              sum + Number(student.profile?.dsaScore || 0),
            0
          ) / students.length
        : 0;

    const avgAptitude =
      students.length > 0
        ? students.reduce(
            (sum, student) =>
              sum + Number(student.profile?.aptitudeScore || 0),
            0
          ) / students.length
        : 0;

    res.json({
      totalStudents,
      totalFaculty,
      averageCGPA: Number(avgCGPA.toFixed(2)),
      averageAttendance: Number(avgAttendance.toFixed(2)),
      averageDSA: Number(avgDSA.toFixed(2)),
      averageAptitude: Number(avgAptitude.toFixed(2))
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      message: "Failed to load admin statistics"
    });
  }
});

app.get("/api/admin/analytics", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const students = await User.find({
      role: "student"
    }).select("-passwordHash");

    const branchStats = {};
    const semesterStats = {};

    students.forEach((student) => {
      const profile = student.profile || {};

      const branch = profile.branch || "Unknown";
      const semester = profile.semester || "Unknown";

      if (!branchStats[branch]) {
        branchStats[branch] = {
          students: 0,
          totalCGPA: 0,
          totalAttendance: 0
        };
      }

      branchStats[branch].students += 1;
      branchStats[branch].totalCGPA += Number(
        profile.cgpa || 0
      );
      branchStats[branch].totalAttendance += Number(
        profile.attendance || 0
      );

      if (!semesterStats[semester]) {
        semesterStats[semester] = {
          students: 0,
          totalCGPA: 0,
          totalAttendance: 0
        };
      }

      semesterStats[semester].students += 1;
      semesterStats[semester].totalCGPA += Number(
        profile.cgpa || 0
      );
      semesterStats[semester].totalAttendance += Number(
        profile.attendance || 0
      );
    });

    Object.keys(branchStats).forEach((branch) => {
      const item = branchStats[branch];

      item.averageCGPA = Number(
        (item.totalCGPA / item.students).toFixed(2)
      );

      item.averageAttendance = Number(
        (item.totalAttendance / item.students).toFixed(2)
      );

      delete item.totalCGPA;
      delete item.totalAttendance;
    });

    Object.keys(semesterStats).forEach((semester) => {
      const item = semesterStats[semester];

      item.averageCGPA = Number(
        (item.totalCGPA / item.students).toFixed(2)
      );

      item.averageAttendance = Number(
        (item.totalAttendance / item.students).toFixed(2)
      );

      delete item.totalCGPA;
      delete item.totalAttendance;
    });

    const totalStudents = students.length;

    const atRiskDetails = students
  .map((student) => {
    const profile = student.profile || {};
    console.log("RISK PROFILE:", student.name, student.profile);

    const cgpa = Number(profile.cgpa || 0);
    const attendance = Number(profile.attendance || 0);
    const dsaScore = Number(profile.dsaScore || 0);
    const aptitudeScore = Number(profile.aptitudeScore || 0);

   const reasons = [];
const recommendations = [];

if (cgpa < 6.5) {
  reasons.push("Low CGPA");
  recommendations.push("Academic mentoring and subject-wise improvement plan");
}

if (attendance < 70) {
  reasons.push("Low Attendance");
  recommendations.push("Attendance improvement and regular class monitoring");
}

if (dsaScore < 40) {
  reasons.push("Low DSA Score");
  recommendations.push("DSA practice plan with coding problems and weekly assessment");
}

if (aptitudeScore < 40) {
  reasons.push("Low Aptitude Score");
  recommendations.push("Aptitude training with regular mock tests");
}


if (reasons.length === 0) {
  return null;
}
console.log("RISK STUDENT PROFILE:", profile);

const riskScore = reasons.length * 3;

let riskLevel = "Low";

if (
  cgpa < 5.5 ||
  attendance < 60 ||
  dsaScore < 25 ||
  aptitudeScore < 25
) {
  riskLevel = "High";
} else if (
  cgpa < 6.5 ||
  attendance < 70 ||
  dsaScore < 40 ||
  aptitudeScore < 40
) {
  riskLevel = "Medium";
}

  return {
  studentId: student._id,
  name: student.name,
  email: student.email,
  cgpa,
  attendance,
  dsaScore,
  aptitudeScore,
  riskScore,
  riskLevel,
  reasons,
  recommendations
};

  })
  .filter(Boolean);

  const riskReasonSummary = {
  lowCGPA: 0,
  lowAttendance: 0,
  lowDSA: 0,
  lowAptitude: 0
};

atRiskDetails.forEach((student) => {
  if (student.reasons.includes("Low CGPA")) {
    riskReasonSummary.lowCGPA++;
  }

  if (student.reasons.includes("Low Attendance")) {
    riskReasonSummary.lowAttendance++;
  }

  if (student.reasons.includes("Low DSA Score")) {
    riskReasonSummary.lowDSA++;
  }

  if (student.reasons.includes("Low Aptitude Score")) {
    riskReasonSummary.lowAptitude++;
  }
});

   const atRiskStudents = students.filter((student) => {
  const profile = student.profile || {};

  const cgpa = Number(profile.cgpa || 0);
  const attendance = Number(profile.attendance || 0);
  const dsaScore = Number(profile.dsaScore || 0);
  const aptitudeScore = Number(profile.aptitudeScore || 0);

  return (
    cgpa < 6.5 ||
    attendance < 70 ||
    dsaScore < 40 ||
    aptitudeScore < 40
  );
}).length;

const safeStudents =
  totalStudents - atRiskStudents;

const riskPercentage =
  totalStudents > 0
    ? Number(
        ((atRiskStudents / totalStudents) * 100).toFixed(2)
      )
    : 0;

    const totalFaculty = await User.countDocuments({
  role: "faculty"
});

let totalCGPA = 0;
let totalAttendance = 0;
let totalDSA = 0;
let totalAptitude = 0;

students.forEach((student) => {
  const profile = student.profile || {};

  totalCGPA += Number(profile.cgpa || 0);
  totalAttendance += Number(profile.attendance || 0);
  totalDSA += Number(profile.dsaScore || 0);
  totalAptitude += Number(profile.aptitudeScore || 0);
});

const averageCGPA =
  totalStudents > 0
    ? Number((totalCGPA / totalStudents).toFixed(2))
    : 0;

const averageAttendance =
  totalStudents > 0
    ? Number((totalAttendance / totalStudents).toFixed(2))
    : 0;

const averageDSA =
  totalStudents > 0
    ? Number((totalDSA / totalStudents).toFixed(2))
    : 0;

const averageAptitude =
  totalStudents > 0
    ? Number((totalAptitude / totalStudents).toFixed(2))
    : 0;

  res.json({
  totalStudents,
  totalFaculty,
  averageCGPA,
  averageAttendance,
  averageDSA,
  averageAptitude,

  branchStats,
  semesterStats,

  riskAnalytics: {
    totalStudents,
    atRiskStudents,
    safeStudents,
    riskPercentage,
    atRiskDetails,
    riskReasonSummary
  }
});

  } catch (error) {
    console.error("Admin analytics error:", error);

    res.status(500).json({
      message: "Failed to load admin analytics"
    });
  }
});




/* =========================================================
   SERVER START
   ========================================================= */

const port =
  Number(process.env.PORT) || 5000;

try {
  await mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/campus_ai"
  );

  console.log("DATABASE:", mongoose.connection.name);
console.log("DATABASE HOST:", mongoose.connection.host);

  console.log("MongoDB connected.");

  app.listen(
    port,
    () =>
      console.log(
        `CampusAI API listening on http://localhost:${port}`
      )
  );
} catch (error) {
  console.error(
    "MongoDB connection failed:",
    error.message
  );

  console.error(
    "Start MongoDB or update MONGO_URI in server/.env, then restart."
  );

  process.exit(1);
}
