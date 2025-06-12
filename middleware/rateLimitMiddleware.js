const rateLimit = require('express-rate-limit');

/**
 * Super simple rate limiter that will definitely work
 */
const apiRateLimiter = rateLimit({
  // Core settings
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // 1 request per window
  
  // Use simple format
  standardHeaders: true, 
  legacyHeaders: false,
  
  // Identify each client uniquely by IP + path
  keyGenerator: function (req, res) {
    return req.ip + ':' + req.originalUrl;
  },
});

module.exports = apiRateLimiter;