import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.ut.js";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Helper to set cookie and send response
const sendTokenResponse = (user, statusCode, message, res) => {
  const token = generateToken(user._id);

  // Cookie expiration (defaults to 7 days if not set)
  const cookieExpiresDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };

  res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

// @desc    Register a new user
// @route   POST /v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User with this email already exists", 400));
  }

  // Hash the password sent in the body
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  sendTokenResponse(user, 201, "User registered successfully", res);
});

// @desc    Authenticate user & get token
// @route   POST /v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check if password matches using hash library
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  sendTokenResponse(user, 200, "Login successful", res);
});

// @desc    Logout user & clear cookie
// @route   POST /v1/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// @desc    Get current logged-in user
// @route   GET /v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});
