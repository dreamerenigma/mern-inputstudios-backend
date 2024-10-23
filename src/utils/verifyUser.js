import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'No token provided' });
   }
   const token = authHeader.split(' ')[1];
   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
         console.log('Token verification error:', err.message);
         return res.status(403).json({ message: 'Invalid token' });
      }
      console.log('Decoded User:', user);
      req.user = user;
      next();
   });
};