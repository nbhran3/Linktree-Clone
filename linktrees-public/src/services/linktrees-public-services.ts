// Service layer for the public linktree service.
// Handles calling the management service and caching results in Redis.

import dotenv from "dotenv";
import axios from "axios";
import {
  getCachedLinktree,
  LinktreeResponse,
  saveLinktreeToCache,
} from "../repositories/cache-repository.js";

dotenv.config();

export const getLinktreeBySuffix = async (suffix: string) => {
  try {
    // 1. Check Redis cache first
    const cached = await getCachedLinktree(suffix);
    if (cached) {
      return cached;
    }

    // 2. If not in cache, call the management service
    const managementUrl = `${
      process.env.LINKTREES_MANAGEMENT_SERVICE_URL || "http://localhost:3002"
    }/${suffix}/public`;

    const response = await axios.get<LinktreeResponse>(managementUrl);

    if (response.status !== 200) {
      return null;
    }

    // 3. Cache result for a configurable TTL
    const cacheTTL = Number(process.env.REDIS_CACHE_TTL) || 60; // Default: 60 seconds
    await saveLinktreeToCache(suffix, cacheTTL, response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching linktree by suffix:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return null;
  }
};
