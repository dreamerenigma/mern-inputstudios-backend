import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, deletepost, dislikePost, getposts, incrementViews, likePost, sharePost, updatepost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.put("/likePost/:postId", verifyToken, likePost);
router.put("/dislikePost/:postId", verifyToken, dislikePost);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.put("/:postId/incrementViews", incrementViews);
router.put("/:postId/share", sharePost);

export default router;
