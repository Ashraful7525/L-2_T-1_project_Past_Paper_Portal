import pool from '../config/database.js';

export const createComment = async (req, res) => {
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
};
