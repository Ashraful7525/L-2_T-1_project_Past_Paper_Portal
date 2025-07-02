import pool from '../config/database.js';

export const voteSolution = async (req, res) => {
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
};
