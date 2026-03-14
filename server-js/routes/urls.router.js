import express from 'express';
import {
  createShortUrl,
  redirectToLongUrl,
} from "../controllers/urls.controller.js";
const router = express.Router();

router.post('/shortner', createShortUrl);
router.get('/shortner/:shortUrl', redirectToLongUrl);
export const urlsRouter = router;