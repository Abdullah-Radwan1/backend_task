export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Assign validated/parsed data back to req to preserve type safety/casting if schemas transform fields
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    
    next();
  } catch (error) {
    if (error.errors) {
      // Map Zod errors into a clean, developer-friendly list
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.length > 1 ? err.path.slice(1).join('.') : err.path[0],
        message: err.message,
      }));

      const validationError = new Error('Request validation failed');
      validationError.statusCode = 400;
      validationError.errors = formattedErrors;
      return next(validationError);
    }
    
    next(error);
  }
};
