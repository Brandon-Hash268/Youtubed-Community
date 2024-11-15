const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-17175.c85.us-east-1-2.ec2.redns.redis-cloud.com", // e.g., "your-redis-id.redis.cache.amazonaws.com"
  port: 17175, 
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis
