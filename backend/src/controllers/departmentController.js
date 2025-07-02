import pool from '../config/database.js';

export const getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTerms = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT term FROM semesters ORDER BY term');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllLevels = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT level FROM semesters ORDER BY level');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
