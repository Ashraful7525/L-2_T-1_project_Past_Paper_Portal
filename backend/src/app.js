// backend/src/app.js

import express from 'express';
import corsMiddleware from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
