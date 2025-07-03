import express from 'express';
import { createSolution, getSolutionsByQuestionId } from '../controllers/solutionController.js';

const router = express.Router();

router.post('/', createSolution);
router.get('/', getSolutionsByQuestionId);

export default router;
