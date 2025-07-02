import pool from '../config/database.js';

export const searchQuestions = async (req, res) => {
  const { level, term, department, course, year, questionNo } = req.query;

  try {
    // 1. Get semester_ids based on level and term
    let semesterQuery = 'SELECT semester_id FROM semesters WHERE 1=1';
    const semesterParams = [];
    
    if (level) {
      semesterParams.push(parseInt(level));
      semesterQuery += ` AND level = $${semesterParams.length}`;
    }
    if (term) {
      semesterParams.push(parseInt(term));
      semesterQuery += ` AND term = $${semesterParams.length}`;
    }

    const semesterResult = await pool.query(semesterQuery, semesterParams);
    const semesterIds = semesterResult.rows.map(row => row.semester_id);

    // 2. Build questions query
    let questionsQuery = 'SELECT * FROM questions WHERE 1=1';
    const questionsParams = [];
    
    if (semesterIds.length > 0) {
      questionsQuery += ` AND semester_id = ANY($${questionsParams.length + 1}::integer[])`;
      questionsParams.push(semesterIds);
    } else if (level || term) {
      return res.json([]);
    }

    if (course) {
      questionsParams.push(parseInt(course));
      questionsQuery += ` AND course_id = $${questionsParams.length}`;
    }
    if (year) {
      questionsParams.push(parseInt(year));
      questionsQuery += ` AND year = $${questionsParams.length}`;
    }
    if (questionNo) {
      questionsParams.push(parseInt(questionNo));
      questionsQuery += ` AND question_no = $${questionsParams.length}`;
    }

    const questionsResult = await pool.query(questionsQuery, questionsParams);
    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  const { question_no, question_text, course_id, level, term, year } = req.body;
  
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
};

export const bulkCreateQuestions = async (req, res) => {
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
};
