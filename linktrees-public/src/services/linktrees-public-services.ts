import redisClient from "../redis-client.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getLinktreeBySuffix = async (suffix: string) => {
  try {
    const cachedLinktree = await redisClient.get(`linktree:${suffix}`);
    console.log("cachedLinktree", cachedLinktree);
    if (cachedLinktree) {
      return JSON.parse(cachedLinktree);
    }
    const response = await axios.get(
      `${
        process.env.LINKTREES_MANAGEMENT_SERVICE_URL || "http://localhost:3000"
      }/linktrees/${suffix}/public`
    );
    if (response.status !== 200) {
      return null;
    }
    await redisClient.set(`linktree:${suffix}`, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching linktree by suffix:", error);
    return null;
  }
};
