import Post from "../models/Post.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.ut.js";
import { paginate } from "../services/pagination.service.js";

// @desc    Create a new post
// @route   POST /v1/posts
// @access  Private
export const createPost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  const post = await Post.create({
    title,
    content,
    image: req.file ? req.file.filename : null,

    author: req.user._id,
  });

  // Populate author information before returning
  await post.populate("author", "name email");

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

// @desc    Get all posts
// @route   GET /v1/posts
// @access  Private (or Public, but protected per prompt details)
export const getPosts = asyncHandler(async (req, res) => {
  const result = await paginate({
    Model: Post,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    populate: [
      {
        path: "author",
        select: "name email",
      },
    ],
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get post by ID
// @route   GET /v1/posts/:id
// @access  Private
export const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "name email",
  );

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Update a post
// @route   PUT /v1/posts/:id
// @access  Private (Only author)
export const updatePost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Strict ownership check
  if (post.author.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to update this post", 403));
  }

  // Update fields
  if (title) post.title = title;
  if (content) post.content = content;

  const updatedPost = await post.save();
  await updatedPost.populate("author", "name email");

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

// @desc    Delete a post
// @route   DELETE /v1/posts/:id
// @access  Private (Only author)
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Strict ownership check
  if (post.author.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to delete this post", 403));
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});
