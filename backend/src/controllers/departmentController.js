import pool from '../config/database.js';

export const getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllLevels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM levels');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTerms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM terms');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
