import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const app = express();
const PORT = 4000;

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT student_id FROM users LIMIT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY student_id ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all levels
app.get('/api/levels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM levels');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all terms
app.get('/api/terms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM terms');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    console.log(result)
    res.json(result.rows);
  } catch (error) {
    console.log("jygsh")
    res.status(500).json({ error: error.message });
  }
});

// Get courses, optionally filter by department_id
app.get('/api/courses', async (req, res) => {
  const { department_id } = req.query;
  try {
    let query = 'SELECT * FROM courses';
    let params = [];

    if (department_id) {
      query += ' WHERE department_id = $1';
      params.push(department_id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search questions with filters
// Search questions with filters
// Search questions with filters
app.get('/api/questions/search', async (req, res) => {
  const { level, term, department, course, year, questionNo } = req.query;

  try {
    // 1. Get semester_ids based on level and term
    let semesterQuery = 'SELECT semester_id FROM semesters WHERE 1=1';
    const semesterParams = [];
    
    if (level) {
      semesterParams.push(parseInt(level)); // Convert to integer
      semesterQuery += ` AND level = $${semesterParams.length}`;
    }
    if (term) {
      semesterParams.push(parseInt(term)); // Convert to integer
      semesterQuery += ` AND term = $${semesterParams.length}`;
    }

    const semesterResult = await pool.query(semesterQuery, semesterParams);
    const semesterIds = semesterResult.rows.map(row => row.semester_id);

    // 2. Build questions query
    let questionsQuery = 'SELECT * FROM questions WHERE 1=1';
    const questionsParams = [];
    
    if (semesterIds.length > 0) {
      questionsQuery += ` AND semester_id = ANY($${questionsParams.length + 1}::integer[])`; // Changed to integer[]
      questionsParams.push(semesterIds);
    } else if (level || term) {
      // If level/term filters were applied but no semesters found, return empty result
      return res.json([]);
    }

    if (course) {
      questionsParams.push(parseInt(course)); // Convert to integer
      questionsQuery += ` AND course_id = $${questionsParams.length}`;
    }
    if (year) {
      questionsParams.push(parseInt(year)); // Convert to integer
      questionsQuery += ` AND year = $${questionsParams.length}`;
    }
    if (questionNo) {
      questionsParams.push(parseInt(questionNo)); // Convert to integer
      questionsQuery += ` AND question_no = $${questionsParams.length}`;
    }

    const questionsResult = await pool.query(questionsQuery, questionsParams);
    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
