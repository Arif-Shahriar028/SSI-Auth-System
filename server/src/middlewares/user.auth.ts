import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}


export const userAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('cookie token: ', req.cookies.token);
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-secret-key') as {
      email: string;
      name: string;
      phone: string;
    };
    
    // Check cache first
    req.user = {
      email: decoded.email,
      name: decoded.name,
      phone: decoded.phone,
    };
    req.token = token;
    next();
  } catch (error) {
    console.log('error: ', error);
    res.status(401).json({ success: false, error: 'Please authenticate' });
  }
};
