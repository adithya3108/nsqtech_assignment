import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to simulate API delay for demonstrating async processing
 * Accepts 'delay' query parameter in milliseconds (default: 0, max: 5000)
 */
export const simulateDelay = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const delayParam = req.query.delay as string;
  const delay = delayParam ? parseInt(delayParam, 10) : 0;

  // Cap delay at 5 seconds for safety
  const actualDelay = Math.min(Math.max(delay, 0), 5000);

  if (actualDelay > 0) {
    console.log(`Simulating API delay of ${actualDelay}ms`);
    setTimeout(() => {
      next();
    }, actualDelay);
  } else {
    next();
  }
};
