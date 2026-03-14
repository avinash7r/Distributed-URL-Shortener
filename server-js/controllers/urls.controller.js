import {
  insertLongUrl,
  getUrlByShortUrl,
  updateShortUrl,
  incrementCounter,
} from "./DB.controller.js";
import redisClient from "../utils/redis.js";

export const createShortUrl = async (req, res) => {
  try {
    console.log({
      level: "info",
      message: "Received request to shorten URL",
      body: req.body,
    });
    const longUrl = req.body.longUrl;
    if (!longUrl) {
      return res.status(400).json({ message: "longUrl is required" });
    }
    const id = await insertLongUrl(longUrl);
    const shortUrl = Buffer.from(id.toString()).toString("base64").slice(0, 6);
    const updatedUrl = await updateShortUrl(id, shortUrl);
    res.status(201).json({ shortUrl: updatedUrl.short_url });
    console.log({
      level: "info",
      message: `URL shortened: ${longUrl} -> ${shortUrl}`,
    });
  } catch (error) {
    console.error({ level: "error", message: error.message });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const redirectToLongUrl = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const cachedLongUrl = await redisClient.get(`url:${shortUrl}`);

    if (cachedLongUrl) {
      console.log({
        level: "info",
        message: `Cache hit for shortUrl: ${shortUrl}`,
      });

      return res.redirect(cachedLongUrl);
    }
    console.log({
      level: "info",
      message: `Cache miss for shortUrl: ${shortUrl}`,
    });

    const urlData = await getUrlByShortUrl(shortUrl);

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    await redisClient.set(`url:${shortUrl}`, urlData.long_url, {
      EX: 3600, // cache expires in 1 hour
    });

    await incrementCounter(urlData.id);
    return res.redirect(urlData.long_url);

  } catch (error) {
    console.error({ level: "error", message: error.message });
    res.status(500).json({ message: "Internal Server Error" });
  }
};