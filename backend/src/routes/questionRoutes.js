import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  searchQuestions,
  createQuestion,
  bulkCreateQuestions
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getAllQuestions);              // GET /api/questions
router.get('/search', searchQuestions);        // GET /api/questions/search
router.get('/:id', getQuestionById);           // GET /api/questions/:id
router.post('/', createQuestion);              // POST /api/questions
router.post('/bulk', bulkCreateQuestions);     // POST /api/questions/bulk

export default router;
