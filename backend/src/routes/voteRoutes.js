import express from 'express';
import { voteSolution } from '../controllers/voteController.js';

const router = express.Router();

router.post('/solutions/:id', voteSolution);

export default router;
