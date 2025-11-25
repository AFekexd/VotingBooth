import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import voteRoutes from './routes/voteRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import apiLogger from './middleware/apiLogger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded - for parsing form data
app.use(express.urlencoded({ extended: true }));

// API request logging middleware (logs all requests to database)
app.use(apiLogger);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'VotingBooth API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/v1/votes', voteRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.originalUrl} not found`
        }
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/v1/votes`);
});

export default app;
