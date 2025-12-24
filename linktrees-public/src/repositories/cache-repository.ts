// Repository for caching linktrees in Redis for the public service.
// This file encapsulates all direct Redis access.

import redisClient from "../redis-client.js";

// Shape of the data we store in Redis and return from the public service
export type LinktreeResponse = {
  linktreeSuffix: string;
  links: {
    id: number;
    link_text: string;
    link_url: string;
    linktree_id: number;
  }[];
};

// Try to read a linktree from Redis cache by suffix
// Returns null if cache miss or if Redis is unavailable (graceful degradation)
export async function getCachedLinktree(suffix: string) {
  try {
    const cachedLinktree = await redisClient.get(`linktree:${suffix}`);

    if (cachedLinktree) {
      return JSON.parse(cachedLinktree);
    }
    return null;
  } catch (error: any) {
    // If Redis fails (e.g., not configured on Render), continue without cache
    console.error(`[Redis] Cache read failed: ${error.message}`);
    return null;
  }
}

// Save a linktree response to Redis with a given TTL (in seconds)
// Silently fails if Redis is unavailable (graceful degradation)
export async function saveLinktreeToCache(
  suffix: string,
  cacheTTL: number,
  response: LinktreeResponse
) {
  try {
    await redisClient.setex(
      `linktree:${suffix}`,
      cacheTTL,
      JSON.stringify(response)
    );
  } catch (error: any) {
    // If Redis fails (e.g., not configured on Render), continue without cache
    console.error(`[Redis] Cache save failed: ${error.message}`);
  }
}
