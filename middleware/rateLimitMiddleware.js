const rateLimit = require('express-rate-limit');

/**
 * Rate limiter configuration with user-friendly error messages
 */
const apiRateLimiter = rateLimit({
  // Core settings
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // 5 requests per window
  
  // Use simple format
  standardHeaders: true, 
  legacyHeaders: false,
  
  // User-friendly error message
  message: {
    status: 429,
    error: 'For mange forespørseler',
    message: 'Du har sendt for mange forespørseler på kort tid.',
    suggestion: 'Vennligst vent noen sekunder før du prøver igjen.'
  },
  
  // Identify each client uniquely by IP + path
  keyGenerator: function (req, res) {
    return req.ip + ':' + req.originalUrl;
  },
});

module.exports = apiRateLimiter;