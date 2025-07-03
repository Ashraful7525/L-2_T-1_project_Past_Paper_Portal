import pool from '../config/database.js';

// POST /api/solutions
export const createSolution = async (req, res) => {
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
};

// GET /api/solutions?question_id=...
export const getSolutionsByQuestionId = async (req, res) => {
  const { question_id } = req.query;
  if (!question_id) {
    return res.status(400).json({ success: false, error: 'Missing question_id in query' });
  }

  try {
    const selectQuery = `
      SELECT * FROM solutions WHERE question_id = $1 ORDER BY solution_id ASC
    `;
    const result = await pool.query(selectQuery, [parseInt(question_id)]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
