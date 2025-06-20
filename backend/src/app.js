import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { supabase } from '../config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await supabase.from('users').select('student_id').limit(1);
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ✅ Get all users
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('student_id', { ascending: true });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
});

// ✅ Get all levels
app.get('/api/levels', async (req, res) => {
  const { data, error } = await supabase.from('levels').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.log("Levels Data:", data); // Log the levels data to the console for debugging

  res.json(data);  // Ensure this is an array of objects
});

// ✅ Get all terms
app.get('/api/terms', async (req, res) => {
  const { data, error } = await supabase.from('terms').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.log("Terms Data:", data); // Log the terms data to the console for debugging

  res.json(data);  // Ensure this is an array of objects
});


// ✅ Get all departments
app.get('/api/departments', async (req, res) => {
  const { data, error } = await supabase.from('departments').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ Get courses (optionally filter by department_id)
app.get('/api/courses', async (req, res) => {
  const { department_id } = req.query;

  let query = supabase.from('courses').select('*');
  if (department_id) {
    query = query.eq('department_id', department_id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Search questions with filters
app.get('/api/questions/search', async (req, res) => {
  const { level, term, department, course, year, questionNo } = req.query;

  let semesterIds = [];

  // Retrieve semester_id based on level and term
  if (level && term) {
    // If both level and term are provided, filter by both
    const { data: semesters, error: semError } = await supabase
      .from('semesters')
      .select('semester_id')
      .eq('level', level)  // WHERE level = level
      .eq('term', term);   // AND term = term

    if (semError) {
      return res.status(500).json({ error: semError.message });
    }

    semesterIds = semesters?.map(s => s.semester_id) || [];
  } else if (level) {
    // If only level is provided, filter by level
    const { data: semesters, error: semError } = await supabase
      .from('semesters')
      .select('semester_id')
      .eq('level', level); // WHERE level = level

    if (semError) {
      return res.status(500).json({ error: semError.message });
    }

    semesterIds = semesters?.map(s => s.semester_id) || [];
  } else if (term) {
    // If only term is provided, filter by term
    const { data: semesters, error: semError } = await supabase
      .from('semesters')
      .select('semester_id')
      .eq('term', term); // WHERE term = term

    if (semError) {
      return res.status(500).json({ error: semError.message });
    }

    semesterIds = semesters?.map(s => s.semester_id) || [];
  }

  // Build query for questions with optional filters
  let query = supabase.from('questions').select('*');

  // Apply semester_id filter
  if (semesterIds.length > 0) query = query.in('semester_id', semesterIds);

  if (course) query = query.eq('course_id', course); // Filter by course_id
  if (year) query = query.eq('year', year); // Filter by year
  if (questionNo) query = query.eq('question_no', questionNo); // Filter by question number

  // Return search results
  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);  // Return the filtered data
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
