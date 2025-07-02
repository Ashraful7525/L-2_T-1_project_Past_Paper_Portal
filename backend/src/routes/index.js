import express from 'express';
import healthRoutes from './healthRoutes.js';
import userRoutes from './userRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import courseRoutes from './courseRoutes.js';
import questionRoutes from './questionRoutes.js';
import solutionRoutes from './solutionRoutes.js';
import commentRoutes from './commentRoutes.js';
import voteRoutes from './voteRoutes.js';
import levelsRoutes from './levelsRoutes.js';
import termsRoutes from './termsRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/courses', courseRoutes);
router.use('/questions', questionRoutes);
router.use('/solutions', solutionRoutes);
router.use('/comments', commentRoutes);
router.use('/votes', voteRoutes);
router.use('/levels', levelsRoutes);
router.use('/terms', termsRoutes);

export default router;
