import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export interface JwtUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
} 