import AppError from '../utils/AppError.js';

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Default to 500 server error if not set
    statusCode = statusCode || 500;
    message = message || 'Internal Server Error';

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥:', err);
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

export default errorHandler;
