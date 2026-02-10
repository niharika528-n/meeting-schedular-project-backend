const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const validateRequest = require('./middlewares/validateRequest');
const { API_PREFIX } = require('./config/constants');

// Import routes
const userRoutes = require('./modules/user/routes');
const meetingRoutes = require('./modules/meeting/routes');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors());

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request validation middleware
app.use(validateRequest);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/meetings`, meetingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
