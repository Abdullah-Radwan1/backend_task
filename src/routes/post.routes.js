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
import { createUploader } from "../middlewares/upload.middleware.js";

const router = Router();
const postUpload = createUploader("posts");

// Public routes
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protected routes
router.post(
  "/",
  protect,
  postUpload.single("image"),
  validate(createPostSchema),
  createPost,
);

router.put("/:id", protect, validate(updatePostSchema), updatePost);

router.delete("/:id", protect, deletePost);

export default router;
