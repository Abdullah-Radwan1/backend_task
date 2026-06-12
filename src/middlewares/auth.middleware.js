import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve user from database (excluding the hashed password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        const err = new Error('Not authorized, user not found');
        err.statusCode = 401;
        return next(err);
      }

      // Attach user to request context
      req.user = user;
      return next();
    } catch (error) {
      const err = new Error('Not authorized, token verification failed');
      err.statusCode = 401;
      return next(err);
    }
  }

  if (!token) {
    const err = new Error('Not authorized, no token provided');
    err.statusCode = 401;
    return next(err);
  }
};
