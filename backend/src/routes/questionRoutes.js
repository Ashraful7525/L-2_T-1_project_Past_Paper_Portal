import express from 'express';
import { searchQuestions, createQuestion, bulkCreateQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.get('/search', searchQuestions);
router.post('/', createQuestion);
router.post('/bulk', bulkCreateQuestions);

export default router;
