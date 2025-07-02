import express from 'express';
import { getAllLevels } from '../controllers/departmentController.js';

const router = express.Router();
router.get('/', getAllLevels);
export default router;
