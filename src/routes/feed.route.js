import express from "express";
import { getfeeds } from "../controllers/feed.controller";

const router = express.Router();

router.get("/getfeeds", getfeeds);

export default router;
