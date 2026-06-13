import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/appError.ut.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized, no token provided', 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve user from database (excluding the hashed password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new AppError('Not authorized, user not found', 401));
    }

    // Attach user to request context
    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError('Not authorized, token verification failed', 401));
  }
};
