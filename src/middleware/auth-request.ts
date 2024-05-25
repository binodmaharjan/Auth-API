// customTypes.ts
import { Request } from 'express';

// Extend the default Request type with the custom property
interface AuthRequest extends Request {
  userId?: number;
}

export { AuthRequest };
