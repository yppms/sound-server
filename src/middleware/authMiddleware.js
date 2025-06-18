export const wsAuthMiddleware = (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return false;
  return authHeader === process.env.SECRET;
}

export const restAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== process.env.SECRET) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized',
    });
  }
  next();
};
