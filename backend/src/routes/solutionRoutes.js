import express from 'express';
import { createSolution } from '../controllers/solutionController.js';

const router = express.Router();

router.post('/', createSolution);

export default router;
