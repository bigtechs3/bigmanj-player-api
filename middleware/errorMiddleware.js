// --- NOT FOUND MIDDLEWARE ---
// This catches any request that doesn't match an existing route
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// --- ERROR HANDLER MIDDLEWARE ---
// This catches all errors and sends a clean JSON response
const errorHandler = (err, req, res, next) => {
    // Sometimes the status code is 200 even if there's an error. Set it to 500 if so.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        status: false,
        message: err.message,
        // Show stack trace only in development mode (not in production)
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };