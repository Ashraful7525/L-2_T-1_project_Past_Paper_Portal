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
    //console.log("jygsh")
    res.status(500).json({ error: error.message });
  }
});

// GET /api/departments ─ returns department name + post count (most-active first)
app.get('/api/departments/popular', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ('p/' || REGEXP_REPLACE(REPLACE(d.department_name, ' ', ''), 'engineering', 'Eng', 'gi')) AS name,
        COUNT(q.question_id)::INT AS posts,
        d.icon AS icon
      FROM departments d
      LEFT JOIN courses c ON d.department_id = c.department_id
      LEFT JOIN questions q ON c.course_id = q.course_id
      GROUP BY d.department_name, d.icon
      ORDER BY posts DESC;
    `);

    res.json(result.rows);              // ➜ [{ name: "CSE", posts: 45200 }, …]
  } catch (error) {
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


app.post('/api/questions', async (req, res) => {
  const { question_no, question_text, course_id, level, term, year } = req.body;
  
  // Validation
  if (!question_no || !question_text || !course_id || !level || !term || !year) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: question_no, question_text, course_id, level, term, year' 
    });
  }

  try {
    const semesterQuery = 'SELECT semester_id FROM semesters WHERE level = $1 AND term = $2';
    const semesterResult = await pool.query(semesterQuery, [parseInt(level), parseInt(term)]);
    
    if (semesterResult.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: `No semester found for level ${level} and term ${term}` 
      });
    }
    
    const semester_id = semesterResult.rows[0].semester_id;
 
    const insertQuery = `
      INSERT INTO questions (question_no, question_text, course_id, semester_id, year)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      parseInt(question_no),
      question_text,
      parseInt(course_id),
      semester_id,
      parseInt(year)
    ]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Question created successfully',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error inserting question:', error);
    
    // Handle specific database errors
    if (error.code === '23503') {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid course_id' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
});
//it works fine

app.post('/api/solutions', async (req, res) => {
  const { student_id, question_id, solution_text } = req.body;
  
  if (!student_id || !question_id || !solution_text) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: student_id, question_id, solution_text' 
    });
  }

  try {
    const insertQuery = `
      INSERT INTO solutions (student_id, question_id, solution_text, upvotes, downvotes, rating)
      VALUES ($1, $2, $3, 0, 0, 0)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      parseInt(student_id),
      parseInt(question_id),
      solution_text
    ]);
    
    await pool.query(
      'UPDATE users SET contribution = contribution + 1 WHERE student_id = $1',
      [parseInt(student_id)]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Solution created successfully',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error inserting solution:', error);
    
    // Handle specific database errors
    if (error.code === '23503') { 
      res.status(400).json({ 
        success: false, 
        error: 'Invalid student_id or question_id' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
});
//it also works fine

app.post('/api/questions/bulk', async (req, res) => {
  const { questions } = req.body;
  
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'questions array is required and cannot be empty' 
    });
  }

  for (const question of questions) {
    if (!question.question_no || !question.question_text || !question.course_id || !question.level || !question.term || !question.year) {
      return res.status(400).json({ 
        success: false, 
        error: 'Each question must have: question_no, question_text, course_id, level, term, year' 
      });
    }
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const insertedQuestions = [];
    
    for (const question of questions) {
      // Find semester_id for each question
      const semesterQuery = 'SELECT semester_id FROM semesters WHERE level = $1 AND term = $2';
      const semesterResult = await client.query(semesterQuery, [parseInt(question.level), parseInt(question.term)]);
      
      if (semesterResult.rows.length === 0) {
        throw new Error(`No semester found for level ${question.level} and term ${question.term}`);
      }
      
      const semester_id = semesterResult.rows[0].semester_id;
      
      const insertQuery = `
        INSERT INTO questions (question_no, question_text, course_id, semester_id, year)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const result = await client.query(insertQuery, [
        parseInt(question.question_no),
        question.question_text,
        parseInt(question.course_id),
        semester_id,
        parseInt(question.year)
      ]);
      
      insertedQuestions.push(result.rows[0]);
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      success: true, 
      message: `${insertedQuestions.length} questions created successfully`,
      data: insertedQuestions 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error bulk inserting questions:', error);
    
    if (error.code === '23503') {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid course_id in one or more questions' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } finally {
    client.release();
  }
});
//it works fine

app.post('/api/comments', async (req, res) => {
  const { solution_id, student_id, comment_text } = req.body;
  
  if (!solution_id || !student_id || !comment_text) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: solution_id, student_id, comment_text' 
    });
  }

  try {
    const insertQuery = `
      INSERT INTO comments (solution_id, student_id, comment_text, upvotes, downvotes)
      VALUES ($1, $2, $3, 0, 0)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      parseInt(solution_id),
      parseInt(student_id),
      comment_text
    ]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Comment created successfully',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error inserting comment:', error);
    
    if (error.code === '23503') {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid solution_id or student_id' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
});
//it works fine


app.post('/api/solutions/:id/vote', async (req, res) => {
  const { id: solution_id } = req.params;
  const { student_id, vote_type } = req.body;
  
  if (!student_id || !vote_type || !['upvote', 'downvote'].includes(vote_type)) {
    return res.status(400).json({ 
      success: false, 
      error: 'student_id and vote_type (upvote/downvote) are required' 
    });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if user has already voted on this solution
    const existingVote = await client.query(
      'SELECT vote_type FROM solution_votes WHERE student_id = $1 AND solution_id = $2',
      [parseInt(student_id), parseInt(solution_id)]
    );
    
    if (existingVote.rows.length > 0) {
      const currentVote = existingVote.rows[0].vote_type;
      
      if (currentVote === vote_type) {
        // Same vote - remove it (toggle off)
        await client.query(
          'DELETE FROM solution_votes WHERE student_id = $1 AND solution_id = $2',
          [parseInt(student_id), parseInt(solution_id)]
        );
        
        // Update solution vote count
        if (vote_type === 'upvote') {
          await client.query(
            'UPDATE solutions SET upvotes = upvotes - 1 WHERE solution_id = $1',
            [parseInt(solution_id)]
          );
        } else {
          await client.query(
            'UPDATE solutions SET downvotes = downvotes - 1 WHERE solution_id = $1',
            [parseInt(solution_id)]
          );
        }
        
        await client.query('COMMIT');
        res.json({ success: true, message: 'Vote removed' });
      } else {
        // Different vote - update it
        await client.query(
          'UPDATE solution_votes SET vote_type = $1 WHERE student_id = $2 AND solution_id = $3',
          [vote_type, parseInt(student_id), parseInt(solution_id)]
        );
        
        // Update solution vote counts (remove old, add new)
        if (currentVote === 'upvote') {
          await client.query(
            'UPDATE solutions SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE solution_id = $1',
            [parseInt(solution_id)]
          );
        } else {
          await client.query(
            'UPDATE solutions SET downvotes = downvotes - 1, upvotes = upvotes + 1 WHERE solution_id = $1',
            [parseInt(solution_id)]
          );
        }
        
        await client.query('COMMIT');
        res.json({ success: true, message: 'Vote updated' });
      }
    } else {
      // New vote
      await client.query(
        'INSERT INTO solution_votes (student_id, solution_id, vote_type) VALUES ($1, $2, $3)',
        [parseInt(student_id), parseInt(solution_id), vote_type]
      );
      
      // Update solution vote count
      if (vote_type === 'upvote') {
        await client.query(
          'UPDATE solutions SET upvotes = upvotes + 1 WHERE solution_id = $1',
          [parseInt(solution_id)]
        );
      } else {
        await client.query(
          'UPDATE solutions SET downvotes = downvotes + 1 WHERE solution_id = $1',
          [parseInt(solution_id)]
        );
      }
      
      await client.query('COMMIT');
      res.json({ success: true, message: 'Vote added' });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error handling vote:', error);
    
    if (error.code === '23503') {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid student_id or solution_id' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } finally {
    client.release();
  }
});