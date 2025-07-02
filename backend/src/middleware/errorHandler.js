export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle specific database errors if needed
    if (err.code === '23503') {
      // Foreign key violation
      return res.status(400).json({
        success: false,
        error: 'Foreign key constraint violation',
      });
    }
    if (err.code === '23505') {
      // Unique constraint violation
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry',
      });
    }
  
    // Generic error fallback
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  };
  