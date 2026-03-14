import { createClient } from "redis";


async function connectRedis() {
  const client = createClient({
    url: process.env.REDIS_URL || "redis://redis:6379",
  });

  client.on("error", (err) => console.error({ level: "error", message: "Redis Client Error" }, err));

  await client.connect();
  console.log({ level: "info", message: "Connected to Redis" });
  return client;
}

const redisClient = await connectRedis();

export default redisClient;