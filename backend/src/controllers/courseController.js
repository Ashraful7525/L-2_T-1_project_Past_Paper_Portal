import pool from '../config/database.js';

export const getCourses = async (req, res) => {
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
};
