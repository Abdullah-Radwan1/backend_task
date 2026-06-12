import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema.js';

const router = Router();

// All post endpoints require authentication
router.use(protect);

router
  .route('/')
  .get(getPosts)
  .post(validate(createPostSchema), createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(validate(updatePostSchema), updatePost)
  .delete(deletePost);

export default router;
