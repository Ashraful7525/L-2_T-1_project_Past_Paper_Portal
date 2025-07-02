import express from 'express';
import { getAllDepartments, getAllLevels, getAllTerms } from '../controllers/departmentController.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/levels', getAllLevels);
router.get('/terms', getAllTerms);

export default router;
