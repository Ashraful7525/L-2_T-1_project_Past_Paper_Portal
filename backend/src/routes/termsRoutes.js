import express from 'express';
import { getAllTerms } from '../controllers/departmentController.js';

const router = express.Router();
router.get('/', getAllTerms);
export default router;
