import express from 'express';
import { createComment, getCommentsBySolutionId } from '../controllers/commentController.js';

const router = express.Router();

router.post('/', createComment);
router.get('/', getCommentsBySolutionId);

export default router;
