import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "../schemas/post.schema.js";

const router = Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protected routes
router.post("/", protect, validate(createPostSchema), createPost);

router.put("/:id", protect, validate(updatePostSchema), updatePost);

router.delete("/:id", protect, deletePost);

export default router;
