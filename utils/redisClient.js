const redis = require("redis");
const Redis = require("ioredis");
require("dotenv").config();

const redisClient = new Redis(
  `rediss://default:${process.env.REDIS_PASSWORD}@magical-loon-29812.upstash.io:6379`
);

redisClient.on("connect", async function () {
  console.log("Redis client connected");
});

module.exports = redisClient;
