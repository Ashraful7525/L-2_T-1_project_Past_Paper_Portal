import pool from '../config/database.js';

export const healthCheck = async (req, res) => {
  try {
    const result = await pool.query('SELECT student_id FROM users LIMIT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
