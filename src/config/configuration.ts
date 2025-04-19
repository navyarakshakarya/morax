export default () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number.parseInt(process.env.PORT!!, 10) || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Database configuration
  DB_URL: process.env.DB_URL,
  DB_SSL: process.env.DB_SSL === 'true',

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
});
