// Redis client shared by the public service for caching linktrees.

import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  // Simple retry strategy to reconnect quickly at first, then back off
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("Redis connected (Public Service)"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;